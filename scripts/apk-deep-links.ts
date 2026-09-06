#!/usr/bin/env npx tsx
/**
 * apk-deep-links.ts — extract & validate Android deep links for any APK / appId
 *
 * Ponytail: shortest path — stdlib + fast-xml-parser + java+unzip only.
 * No new deps required for validate-only. For APK extraction, tries in order:
 *   1. apkanalyzer (Android SDK)
 *   2. aapt2 dump xmltree
 *   3. app-info-parser (pure JS, `pnpm add -D app-info-parser` if missing)
 *   4. apktool.jar (auto-downloaded to /tmp)
 *
 * Usage:
 *   npx tsx scripts/apk-deep-links.ts extract <apkOrAppId> [--json] [--deep-only] [--apk <path>]
 *   npx tsx scripts/apk-deep-links.ts validate [--apk <apk>] [--service <id>] [--json]
 *   npx tsx scripts/apk-deep-links.ts download <appId> [--out <dir>]
 *
 * mise wrappers (see mise.toml):
 *   mise run apk:extract -- com.moviebase
 *   mise run apk:extract -- ./downloads/com.moviebase.apk
 *   mise run apk:validate
 *   mise run apk:validate -- --apk ./downloads/com.moviebase.apk --service moviebase
 */

import fs from "node:fs";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { XMLParser } from "fast-xml-parser";

// --- types ---
interface IntentData {
  scheme?: string;
  host?: string;
  port?: string;
  path?: string;
  pathPattern?: string;
  pathPrefix?: string;
  pathSuffix?: string;
  mimeType?: string;
}
interface IntentFilter {
  component_type: string;
  component_name: string;
  actions: string[];
  categories: string[];
  data: IntentData[];
  autoVerify?: boolean;
}

const ensureArray = <T>(v: T | T[] | undefined | null): T[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
};

const has = (cmd: string): boolean => {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch { return false; }
};

const run = (cmd: string, opts: { timeout?: number } = {}): string => {
  return execSync(cmd, { encoding: "utf-8", timeout: opts.timeout ?? 30_000, maxBuffer: 10 * 1024 * 1024 });
};

// --- manifest extraction ---
async function extractManifestXml(apkPath: string): Promise<string> {
  const abs = path.resolve(apkPath);
  if (!fs.existsSync(abs)) throw new Error(`APK not found: ${abs}`);

  // 0. direct XML file (for testing: --apk /path/to/AndroidManifest.xml)
  if (abs.endsWith(".xml")) {
    const xml = fs.readFileSync(abs, "utf-8");
    if (xml.includes("<manifest")) return xml;
    throw new Error(`Not a manifest XML: ${abs}`);
  }

  // 0b. try plain unzip (handles test APKs with plain XML manifest)
  try {
    const maybe = run(`unzip -p "${abs}" AndroidManifest.xml 2>/dev/null | head -c 200000`);
    if (maybe.includes("<manifest")) return maybe;
  } catch {}

  // 1. apkanalyzer
  if (has("apkanalyzer")) {
    try {
      // apkanalyzer manifest print <apk>
      const xml = run(`apkanalyzer manifest print "${abs}"`);
      if (xml.includes("<manifest")) return xml;
    } catch {}
  }

  // 2. aapt / aapt2
  for (const bin of ["aapt2", "aapt"]) {
    if (has(bin)) {
      try {
        const out = run(`${bin} dump xmltree "${abs}" --file AndroidManifest.xml`);
        // aapt dump is not XML; fallback to apktool instead
        if (out.includes("http://schemas.android.com")) throw new Error("binary tree");
      } catch {}
    }
  }

  // 3. app-info-parser (pure JS)
  try {
    // dynamic import so script works without the dep
    const mod = await import("app-info-parser");
    const Parser = (mod as any).default ?? (mod as any).AppInfoParser ?? mod;
    const parser = new Parser(abs);
    const result = await parser.parse();
    // app-info-parser doesn't expose raw manifest XML, but exposes parsed manifest
    // If it has manifest content, try to get XML via alternative: just fail to next
    if (result?.manifest) {
      // No XML needed — we can build IntentFilters directly if library exposes it
      // But most versions don't; fall through to apktool
      throw new Error("app-info-parser no XML");
    }
  } catch {}

  // 4. apktool (auto-download jar if needed)
  const apktoolJar = "/tmp/apktool.jar";
  const apktoolWrapper = has("apktool") ? "apktool" : null;

  const getApktoolCmd = (): string | null => {
    if (apktoolWrapper) return apktoolWrapper;
    if (fs.existsSync(apktoolJar)) return `java -jar "${apktoolJar}"`;
    return null;
  };

  let apktoolCmd = getApktoolCmd();
  if (!apktoolCmd) {
    // try to download apktool.jar
    const jarUrl = "https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.12.0.jar";
    try {
      console.error(`[*] apktool not found, downloading to ${apktoolJar} ...`);
      run(`curl -L -o "${apktoolJar}" "${jarUrl}"`);
      apktoolCmd = `java -jar "${apktoolJar}"`;
    } catch (e) {
      throw new Error(
        `No manifest extractor available. Install one of:\n` +
        `  - Android SDK apkanalyzer (cmdline-tools)\n` +
        `  - apktool (https://apktool.org/docs/install)\n` +
        `  - pnpm add -D app-info-parser\n` +
        `Then re-run. Original error: ${e}`
      );
    }
  }

  // handle XAPK
  let apkToUse = abs;
  let tmpXapkDir: string | null = null;
  if (abs.endsWith(".xapk")) {
    tmpXapkDir = "/tmp/xapk_extracted_" + Date.now();
    fs.mkdirSync(tmpXapkDir, { recursive: true });
    run(`unzip -o -q "${abs}" -d "${tmpXapkDir}"`);
    const files = fs.readdirSync(tmpXapkDir).filter(f => f.endsWith(".apk"));
    if (!files.length) throw new Error(`No APK inside XAPK: ${abs}`);
    let base = files.find(f => f === "base.apk") ?? files[0];
    // pick largest if no base.apk
    if (!files.includes("base.apk")) {
      let max = -1;
      for (const f of files) {
        const s = fs.statSync(path.join(tmpXapkDir, f)).size;
        if (s > max) { max = s; base = f; }
      }
    }
    apkToUse = path.join(tmpXapkDir, base);
  }

  const outDir = `/tmp/apk_decompiled_${Date.now()}`;
  try {
    fs.rmSync(outDir, { recursive: true, force: true });
  } catch {}
  run(`${apktoolCmd} d "${apkToUse}" -o "${outDir}" -f -s --no-src 2>&1 | head -n 50`);
  const manifestPath = path.join(outDir, "AndroidManifest.xml");
  if (!fs.existsSync(manifestPath)) throw new Error(`apktool did not produce AndroidManifest.xml at ${manifestPath}`);
  let xml = fs.readFileSync(manifestPath, "utf-8");
  // Resolve @string/ references using res/values/strings.xml if present (e.g., allocine deeplink_scheme)
  if (xml.includes("@string/")) {
    try {
      const stringsPath = path.join(outDir, "res/values/strings.xml");
      if (fs.existsSync(stringsPath)) {
        const sXml = fs.readFileSync(stringsPath, "utf-8");
        const sParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const sDoc = sParser.parse(sXml);
        const strings = ensureArray(sDoc?.resources?.string);
        const map = new Map<string, string>();
        for (const s of strings) {
          const name = s["name"];
          const val = s["#text"] ?? s[""] ?? "";
          if (name) map.set(name, String(val));
        }
        xml = xml.replace(/@string\/([A-Za-z0-9_]+)/g, (_, name) => map.get(name) ?? `@string/${name}`);
      }
    } catch {}
  }
  // cleanup
  try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
  if (tmpXapkDir) try { fs.rmSync(tmpXapkDir, { recursive: true, force: true }); } catch {}
  return xml;
}

function parseManifestXml(xml: string): IntentFilter[] {
  let j: any;
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", allowBooleanAttributes: true });
    j = parser.parse(xml);
  } catch (e) {
    // Fallback: regex extract intent-filters for malformed manifests (e.g., Netflix)
    // console.error(`[-] XML parse failed, trying regex fallback: ${e}`);
    return parseManifestXmlRegex(xml);
  }
  const manifest = j?.manifest;
  if (!manifest) {
    // try regex fallback
    return parseManifestXmlRegex(xml);
  }
  const app = manifest.application;
  if (!app) return parseManifestXmlRegex(xml);
  const out: IntentFilter[] = parseManifestXmlFromJson(j);
  return out;
}

function parseManifestXmlRegex(xml: string): IntentFilter[] {
  // Regex fallback for manifests that fast-xml-parser chokes on (Netflix)
  const out: IntentFilter[] = [];
  const filterRe = /<intent-filter[^>]*>([\s\S]*?)<\/intent-filter>/g;
  let m: RegExpExecArray | null;
  // also need to know component type/name; approximate by finding preceding <activity etc.
  const compRe = /<(activity|activity-alias|service|receiver)[^>]*android:name="([^"]+)"[^>]*>/g;
  let compMatch: RegExpExecArray | null;
  const comps: Array<{type:string,name:string,index:number}> = [];
  while ((compMatch = compRe.exec(xml)) !== null) {
    comps.push({type: compMatch[1], name: compMatch[2], index: compMatch.index});
  }
  while ((m = filterRe.exec(xml)) !== null) {
    const filterXml = m[1];
    const filterIndex = m.index;
    // find closest preceding component
    let comp = comps.filter(c => c.index < filterIndex).pop();
    if (!comp) comp = {type: "activity", name: "", index: 0};
    const actions = [...filterXml.matchAll(/<action[^>]*android:name="([^"]+)"[^>]*\/?>/g)].map(x=>x[1]);
    const categories = [...filterXml.matchAll(/<category[^>]*android:name="([^"]+)"[^>]*\/?>/g)].map(x=>x[1]);
    const data: IntentData[] = [...filterXml.matchAll(/<data[^>]*\/?>/g)].map(tag=>{
      const s = tag[0];
      const get = (attr:string) => {
        const mm = s.match(new RegExp(`${attr}="([^"]+)"`));
        return mm?.[1];
      };
      return {
        scheme: get("android:scheme"),
        host: get("android:host"),
        port: get("android:port"),
        path: get("android:path"),
        pathPattern: get("android:pathPattern"),
        pathPrefix: get("android:pathPrefix"),
        pathSuffix: get("android:pathSuffix"),
        mimeType: get("android:mimeType"),
      };
    });
    const autoVerify = /android:autoVerify="true"/.test(m[0]);
    out.push({ component_type: comp.type, component_name: comp.name, actions, categories, data, autoVerify });
  }
  return out;
}

function parseManifestXmlFromJson(j: any): IntentFilter[] {
  const manifest = j?.manifest;
  if (!manifest) return parseManifestXmlRegex(JSON.stringify(j));
  const app = manifest.application;
  if (!app) return [];
  const out: IntentFilter[] = [];
  for (const type of ["activity", "activity-alias", "service", "receiver"]) {
    for (const comp of ensureArray(app[type])) {
      const name = comp["android:name"] ?? comp["android:targetActivity"] ?? "";
      for (const filter of ensureArray(comp["intent-filter"])) {
        const actions = ensureArray(filter.action).map((a: any) => a["android:name"]).filter(Boolean);
        const categories = ensureArray(filter.category).map((c: any) => c["android:name"]).filter(Boolean);
        const data = ensureArray(filter.data).map((d: any) => ({
          scheme: d["android:scheme"],
          host: d["android:host"],
          port: d["android:port"],
          path: d["android:path"],
          pathPattern: d["android:pathPattern"],
          pathPrefix: d["android:pathPrefix"],
          pathSuffix: d["android:pathSuffix"],
          mimeType: d["android:mimeType"],
        }));
        const autoVerify = filter["android:autoVerify"] === "true" || filter["android:autoVerify"] === true;
        // filter out empty intent-filters (e.g., MAIN/LAUNCHER without data)
        out.push({ component_type: type, component_name: name, actions, categories, data, autoVerify });
      }
    }
  }
  return out;
}

function isDeepLink(f: IntentFilter): boolean {
  return f.actions.includes("android.intent.action.VIEW") &&
    f.categories.includes("android.intent.category.BROWSABLE") &&
    f.data.length > 0;
}

function formatDeepLinks(filters: IntentFilter[]): string[] {
  const lines: string[] = [];
  for (const f of filters) {
    for (const d of f.data) {
      // build URI pattern
      let uri = "";
      if (d.scheme) uri += `${d.scheme}://`;
      if (d.host) uri += d.host;
      if (d.port) uri += `:${d.port}`;
      if (d.path) uri += d.path;
      else if (d.pathPrefix) uri += `${d.pathPrefix}*`;
      else if (d.pathPattern) uri += d.pathPattern;
      else if (d.pathSuffix) uri += `*${d.pathSuffix}`;
      else if (d.scheme && !d.host) uri += "*";
      const ver = f.autoVerify ? " [autoVerify]" : "";
      lines.push(`${uri || "(empty)"}  — ${f.component_type} ${f.component_name}${ver}`);
    }
  }
  return lines;
}

// --- APK resolution ---
function resolveApk(input: string): string | null {
  if (!input) return null;
  // direct file path (any existing file, including .apk/.xapk/.xml)
  if (fs.existsSync(input)) return path.resolve(input);
  try { if (fs.existsSync(path.resolve(input))) return path.resolve(input); } catch {}
  // also check .apk/.xapk suffix explicitly for candidates
  if (input.endsWith(".apk") || input.endsWith(".xapk") || input.endsWith(".xml")) {
    return null; // already checked existence above
  }
  // treat as package id: look in downloads/, ./, /tmp
  const candidates = [
    `downloads/${input}.apk`,
    `downloads/${input}.xapk`,
    `./${input}.apk`,
    `/tmp/${input}.apk`,
    input,
  ];
  for (const c of candidates) if (fs.existsSync(c)) return path.resolve(c);
  return null;
}

async function downloadApk(appId: string, outDir = "downloads"): Promise<string | null> {
  fs.mkdirSync(outDir, { recursive: true });
  // try apkeep if installed
  if (has("apkeep")) {
    console.error(`[*] downloading ${appId} via apkeep ...`);
    try {
      run(`apkeep -a ${appId} "${outDir}"`);
      const files = fs.readdirSync(outDir).filter(f => f.includes(appId));
      const xapk = files.find(f => f.endsWith(".xapk"));
      const apk = files.find(f => f.endsWith(".apk"));
      if (xapk) return path.join(path.resolve(outDir), xapk);
      if (apk) return path.join(path.resolve(outDir), apk);
    } catch (e) {
      console.error(`[-] apkeep failed: ${e}`);
    }
  }
  // try curl from apkcombo direct (may be cloudflare-protected; best-effort)
  // We don't auto-download from random mirrors to avoid TOS issues.
  // Just return null and instruct manual download.
  return null;
}

// --- service validation (no APK needed) ---
function loadServices(): Array<{ id: string; androidAppId: string; file: string; raw: string }> {
  const dir = path.resolve("src/data/services");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts"));
  const out: any[] = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const raw = fs.readFileSync(p, "utf-8");
    // extract id and androidAppId via regex (avoid importing .ts with png)
    const idMatch = raw.match(/id:\s*["']([^"']+)["']/);
    const appIdMatch = raw.match(/androidAppId:\s*["']([^"']*)["']/);
    const id = idMatch?.[1] ?? f.replace(".ts", "");
    const androidAppId = appIdMatch?.[1] ?? "";
    out.push({ id, androidAppId, file: p, raw });
  }
  return out;
}

function validateServices(opts: { apkFilters?: IntentFilter[]; serviceId?: string; json?: boolean }): number {
  const services = loadServices();
  const filtered = opts.serviceId ? services.filter(s => s.id === opts.serviceId) : services;
  if (opts.serviceId && filtered.length === 0) {
    console.error(`[-] service not found: ${opts.serviceId}`);
    return 1;
  }

  const apkSchemes = new Set<string>();
  const apkSchemeHosts = new Set<string>(); // e.g., "moviebase://movie"
  if (opts.apkFilters) {
    for (const f of opts.apkFilters.filter(isDeepLink)) {
      for (const d of f.data) {
        if (d.scheme) apkSchemes.add(d.scheme);
        if (d.scheme && d.host) apkSchemeHosts.add(`${d.scheme}://${d.host}`);
        else if (d.scheme && !d.host) apkSchemeHosts.add(`${d.scheme}://*`);
      }
    }
  }

  let errors = 0;
  let warnings = 0;
  const report: any[] = [];

  for (const svc of filtered) {
    const raw = svc.raw;
    const lines = raw.split("\n");
    const issues: string[] = [];

    // Find url lines and correlate with nearby enabled line (within 4 lines above)
    // This is more robust than block splitting for async functions.
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (!line.includes("url:")) continue;
      // extract url template fragment on this line (covers `url: (data) => `...``)
      // For async blocks, the url line is `url: async (data) => {` — skip those (they don't have inline template)
      if (line.includes("async (data)")) continue;
      const urlPart = line.split("url:")[1] ?? "";
      const urlMatch = urlPart.match(/`([^`]+)`/);
      const urlTemplate = urlMatch?.[1] ?? "";
      if (!urlTemplate || !urlTemplate.includes("data.")) continue;

      // look for enabled — prefer same line, then look back
      let enabled = "";
      if (line.includes("enabled:")) {
        enabled = line;
      } else {
        for (let j = idx - 1; j >= Math.max(0, idx - 6); j--) {
          if (lines[j].includes("enabled:")) { enabled = lines[j]; break; }
        }
      }

      const linkIdx = issues.length + 1;
      const idsUsed = [...urlTemplate.matchAll(/\bdata\.(\w+)/g)].map(x => x[1]);
      for (const id of idsUsed) {
        if (["type", "title", "tmdbId", "releaseYear", "rating", "runtime", "genres", "overview"].includes(id)) continue;
        // if url has fallback `||` for this id, it's already safe (e.g., data.letterboxdId || data.tmdbId)
        if (urlTemplate.includes(`data.${id} ||`) || urlTemplate.includes(`|| data.${id}`)) continue;
        const guarded = enabled.includes(`!!data.${id}`) || (enabled.includes(`data.${id}`) && enabled.includes("&&"));
        if (!guarded && !enabled.includes(id)) {
          issues.push(`link ${linkIdx} uses data.${id} in url \`${urlTemplate}\` but enabled \`${enabled.trim()}\` doesn't guard it (add && !!data.${id})`);
          errors++;
        }
      }
      if (urlTemplate.includes("undefined")) {
        issues.push(`link ${linkIdx} url template contains literal "undefined": ${urlTemplate}`);
        errors++;
      }
      // requiresApp check — look at nearby requiresApp line
      let hasRequiresApp = false;
      for (let j = Math.max(0, idx - 4); j <= Math.min(lines.length - 1, idx + 2); j++) {
        if (lines[j].includes("requiresApp: true")) { hasRequiresApp = true; break; }
      }
      if (hasRequiresApp && !svc.androidAppId) {
        issues.push(`link ${linkIdx} requiresApp:true but service androidAppId is empty`);
        warnings++;
      }
      const schemeMatch = urlTemplate.match(/^([a-z0-9+.-]+):\/\//i);
      const scheme = schemeMatch?.[1];
      const hostMatch = urlTemplate.match(/^[a-z0-9+.-]+:\/\/([^\/\?#]+)/i);
      const host = hostMatch?.[1]?.split(":")[0]; // strip port if any
      if (scheme && scheme !== "http" && scheme !== "https" && opts.apkFilters) {
        if (!apkSchemes.has(scheme)) {
          issues.push(`link ${linkIdx} scheme \`${scheme}://\` not found in APK manifest schemes [${[...apkSchemes].join(", ") || "none"}] — deep link will not resolve`);
          errors++;
        } else if (host && !apkSchemeHosts.has(`${scheme}://${host}`) && !apkSchemeHosts.has(`${scheme}://*`)) {
          // host mismatch is more subtle — only error if APK has same scheme but different hosts
          const hostsForScheme = [...apkSchemeHosts].filter(h => h.startsWith(`${scheme}://`)).join(", ");
          issues.push(`link ${linkIdx} host \`${scheme}://${host}\` not found in APK manifest [${hostsForScheme || "none"}] — deep link may not resolve (expected one of: ${hostsForScheme})`);
          errors++;
        }
      }
      if ((scheme === "http" || scheme === "https") && opts.apkFilters) {
        const hasAutoVerify = opts.apkFilters.some(f => f.autoVerify && f.data.some(d => d.scheme === scheme));
        if (!hasAutoVerify) warnings++;
      }
    }

    if (issues.length) {
      report.push({ service: svc.id, androidAppId: svc.androidAppId, file: svc.file, issues });
      if (!opts.json) {
        console.error(`\n[!] ${svc.id} (${svc.androidAppId || "no appId"}) — ${svc.file}`);
        for (const iss of issues) console.error(`  - ${iss}`);
      }
    }
  }

  if (opts.json) {
    console.log(JSON.stringify({ errors, warnings, report }, null, 2));
  } else {
    if (errors === 0 && warnings === 0) {
      console.log(`[✓] All ${filtered.length} services passed validation`);
    } else {
      console.log(`\n[—] Validation: ${errors} error(s), ${warnings} warning(s) across ${filtered.length} service(s)`);
      if (opts.apkFilters) console.log(`    APK schemes: [${[...apkSchemes].join(", ") || "none"}]`);
    }
  }
  return errors > 0 ? 1 : 0;
}

function extractFullMetadata(xml: string, apkPath: string, filters: IntentFilter[]) {
  // Parse manifest for full metadata (beyond deep links) — with regex fallback for Netflix etc.
  let j: any = null;
  let pkg = "", versionName = "", versionCode = "", compileSdk = "", targetSdk = "";
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", allowBooleanAttributes: true });
    j = parser.parse(xml);
    const manifest = j?.manifest ?? {};
    pkg = manifest["package"] ?? manifest["android:package"] ?? "";
    versionName = manifest["android:versionName"] ?? manifest["versionName"] ?? "";
    versionCode = manifest["android:versionCode"] ?? manifest["versionCode"] ?? "";
    compileSdk = manifest["android:compileSdkVersion"] ?? "";
    targetSdk = manifest["android:targetSdkVersion"] ?? manifest["uses-sdk"]?.["android:targetSdkVersion"] ?? "";
  } catch {}
  // Regex fallback for package/version when XMLParser fails (Netflix)
  if (!pkg) {
    const mPkg = xml.match(/<manifest[^>]*\bpackage="([^"]+)"/);
    if (mPkg) pkg = mPkg[1];
  }
  if (!versionName) {
    const mVer = xml.match(/android:versionName="([^"]+)"/);
    if (mVer) versionName = mVer[1];
  }
  if (!versionCode) {
    const mCode = xml.match(/android:versionCode="([^"]+)"/);
    if (mCode) versionCode = mCode[1];
  }
  if (!compileSdk) {
    const mSdk = xml.match(/android:compileSdkVersion="([^"]+)"/);
    if (mSdk) compileSdk = mSdk[1];
  }
  const manifestFallback = j?.manifest ?? {};
  const app = (j?.manifest?.application) ?? {};
  let manifestForMeta: any = j?.manifest ?? {};

  let permissions: string[] = ensureArray(manifestForMeta["uses-permission"]).map((p:any)=>p["android:name"]).filter(Boolean);
  let features: string[] = ensureArray(manifestForMeta["uses-feature"]).map((f:any)=>f["android:name"]).filter(Boolean);
  let queries: any = manifestForMeta["queries"] ?? {};
  let queryPackages: string[] = ensureArray(queries["package"]).map((p:any)=>p["android:name"]).filter(Boolean);
  let queryIntents: any[] = ensureArray(queries["intent"]).map((q:any)=>{
    const a = ensureArray(q["action"]).map((x:any)=>x["android:name"]).filter(Boolean);
    const c = ensureArray(q["category"]).map((x:any)=>x["android:name"]).filter(Boolean);
    const d = ensureArray(q["data"]).map((x:any)=>x["android:scheme"] ?? x["android:host"] ?? "").filter(Boolean);
    return { actions: a, categories: c, data: d };
  }).filter((q:any)=>q.actions.length||q.categories.length||q.data.length);

  // Regex fallback for permissions/queries when XMLParser fails (Netflix)
  if ((!j || !j.manifest) && xml.includes("<uses-permission")) {
    permissions = [...xml.matchAll(/<uses-permission[^>]*android:name="([^"]+)"/g)].map(m=>m[1]);
    features = [...xml.matchAll(/<uses-feature[^>]*android:name="([^"]+)"/g)].map(m=>m[1]);
    const queriesXml = xml.match(/<queries>([\s\S]*?)<\/queries>/);
    if (queriesXml) {
      const qXml = queriesXml[1];
      queryPackages = [...qXml.matchAll(/<package[^>]*android:name="([^"]+)"/g)].map(m=>m[1]);
      // intents inside queries
      queryIntents = [...qXml.matchAll(/<intent>([\s\S]*?)<\/intent>/g)].map(m=>{
        const block = m[1];
        const a = [...block.matchAll(/<action[^>]*android:name="([^"]+)"/g)].map(x=>x[1]);
        const c = [...block.matchAll(/<category[^>]*android:name="([^"]+)"/g)].map(x=>x[1]);
        const d = [...block.matchAll(/<data[^>]*android:(?:scheme|host)="([^"]+)"/g)].map(x=>x[1]);
        return { actions: a, categories: c, data: d };
      }).filter(q=>q.actions.length||q.categories.length||q.data.length);
    }
  }

  const exportedComponents = filters.filter(f=>f.component_type==="activity"||f.component_type==="service"||f.component_type==="receiver")
    .map(f=> ({type: f.component_type, name: f.component_name, exported: true}));

  const deepLinks = filters.filter(isDeepLink);
  const appLinks = deepLinks.filter(f=>f.autoVerify && f.data.some(d=>d.scheme==="https"));
  const customSchemes = [...new Set(deepLinks.flatMap(f=>f.data.map(d=>d.scheme).filter(Boolean) as string[]))];
  const hosts = [...new Set(deepLinks.flatMap(f=>f.data.map(d=>d.host).filter(Boolean) as string[]))];

  // Try to get size and strings
  let apkSize = "";
  try { apkSize = `${(fs.statSync(apkPath).size/1024/1024).toFixed(1)} MB`; } catch {}
  // Deeplink-related strings (heuristic: contains deeplink, scheme, host)
  let deeplinkStrings: string[] = [];
  try {
    // If we still have decoded dir, try to read strings (best-effort, already cleaned)
    // Fallback: grep manifest for @string/ that we resolved earlier would have been replaced, so skip
  } catch {}

  // Icon extraction (best-effort, from APK res/mipmap)
  let iconInfo: any = null;
  try {
    const icon = extractIconInfo(apkPath);
    if (icon) iconInfo = icon;
  } catch {}

  return {
    package: pkg,
    versionName, versionCode, compileSdk, targetSdk,
    apkSize,
    permissions: permissions.slice(0,20), // cap
    permissionsCount: permissions.length,
    features: features.slice(0,10),
    queries: { packages: queryPackages.slice(0,10), packagesCount: queryPackages.length, intents: queryIntents.slice(0,5), intentsCount: queryIntents.length },
    deepLinks: { total: filters.length, deepLinkFilters: deepLinks.length, appLinks: appLinks.length, customSchemes, hosts: hosts.slice(0,10) },
    exportedComponentsCount: exportedComponents.length,
    icon: iconInfo,
  };
}

function extractIconInfo(apkPath: string): { path: string; size: string; found: boolean } | null {
  // Try to find launcher icon via unzip -l, then extract best resolution (handles mipmap/ic_launcher and drawable/icon)
  try {
    const abs = path.resolve(apkPath);
    // Handle XAPK
    let apkToUse = abs;
    let tmpDir: string | null = null;
    if (abs.endsWith(".xapk")) {
      tmpDir = `/tmp/icon_${Date.now()}`;
      fs.mkdirSync(tmpDir, { recursive: true });
      execSync(`unzip -oq "${abs}" -d "${tmpDir}"`, { stdio: "ignore" });
      const files = fs.readdirSync(tmpDir).filter(f=>f.endsWith(".apk"));
      if (files.length) {
        // pick largest
        let best = files[0];
        let max = -1;
        for (const f of files) {
          const s = fs.statSync(path.join(tmpDir,f)).size;
          if (s > max) { max = s; best = f; }
        }
        // also check for base.apk
        const base = files.find(f=>f==="com."+path.basename(abs).split(".")[1]+".apk") ?? best;
        apkToUse = path.join(tmpDir, base);
      }
    }
    // List icons: mipmap ic_launcher, drawable icon, etc. (handles crunchyroll's drawable/icon.png)
    const list = execSync(`unzip -l "${apkToUse}" 2>/dev/null | grep -E "mipmap.*\\.png|drawable.*icon\\.png|drawable.*ic_launcher" | grep -v "mipmap-anydpi" | head -n 30`, {encoding:"utf-8"});
    if (!list.trim()) {
      if (tmpDir) try { fs.rmSync(tmpDir,{recursive:true,force:true}); } catch {}
      return null;
    }
    // Pick highest density (xxxhdpi > xxhdpi > xhdpi > hdpi) and prefer icon.png over others
    const lines = list.split("\n").filter(Boolean);
    const pref = ["xxxhdpi","xxhdpi","xhdpi","hdpi","mdpi"];
    let bestLine: string | undefined;
    for (const p of pref) {
      const candidates = lines.filter(l=>l.includes(p));
      // Prefer icon.png, then ic_launcher.png
      const icon = candidates.find(l=>l.includes("icon.png") && !l.includes("ic_launcher_round"));
      if (icon) { bestLine = icon; break; }
      const launcher = candidates.find(l=>l.includes("ic_launcher"));
      if (launcher) { bestLine = launcher; break; }
      if (candidates.length) { bestLine = candidates[0]; break; }
    }
    if (!bestLine) bestLine = lines.find(l=>l.includes("icon.png")) ?? lines[0];
    const match = bestLine.match(/(\S+\.png)$/);
    const iconPath = match?.[1]?.trim() ?? "";
    if (tmpDir) try { fs.rmSync(tmpDir,{recursive:true,force:true}); } catch {}
    if (!iconPath) return null;
    return { path: iconPath, size: bestLine.trim().split(/\s+/)[0], found: true };
  } catch { return null; }
}

async function extractIconToFile(apkPath: string, outPath: string): Promise<string | null> {
  const abs = path.resolve(apkPath);
  let apkToUse = abs;
  let tmpDir: string | null = null;
  if (abs.endsWith(".xapk")) {
    tmpDir = `/tmp/icon_extract_${Date.now()}`;
    fs.mkdirSync(tmpDir, { recursive: true });
    execSync(`unzip -oq "${abs}" -d "${tmpDir}"`, { stdio: "ignore" });
    const files = fs.readdirSync(tmpDir).filter(f=>f.endsWith(".apk"));
    if (files.length) {
      let best = files[0];
      let max = -1;
      for (const f of files) {
        const s = fs.statSync(path.join(tmpDir,f)).size;
        if (s > max) { max = s; best = f; }
      }
      apkToUse = path.join(tmpDir, best);
    }
  }
  // Find best icon via unzip -l (handles mipmap and drawable/icon.png like crunchyroll)
  let iconPath = "";
  try {
    const list = execSync(`unzip -l "${apkToUse}" 2>/dev/null | grep -E "mipmap.*\\.png|drawable.*icon\\.png|drawable.*ic_launcher" | grep -v "mipmap-anydpi" | head -n 30`, {encoding:"utf-8"});
    const lines = list.split("\n").filter(Boolean);
    const pref = ["xxxhdpi","xxhdpi","xhdpi","hdpi","mdpi"];
    for (const p of pref) {
      const candidates = lines.filter(l=>l.includes(p));
      const icon = candidates.find(l=>l.includes("icon.png") && !l.includes("ic_launcher_round"));
      if (icon) { const m=icon.match(/(\S+\.png)$/); if(m){iconPath=m[1].trim(); break;}}
      const launcher = candidates.find(l=>l.includes("ic_launcher"));
      if (launcher) { const m=launcher.match(/(\S+\.png)$/); if(m){iconPath=m[1].trim(); break;}}
      if (candidates.length) { const m=candidates[0].match(/(\S+\.png)$/); if(m){iconPath=m[1].trim(); break;}}
    }
    if (!iconPath) {
      const fallback = lines.find(l=>l.includes("icon.png")) ?? lines[0];
      if (fallback) { const m=fallback.match(/(\S+\.png)$/); if(m) iconPath=m[1].trim(); }
    }
  } catch {}
  if (!iconPath) {
    if (tmpDir) try { fs.rmSync(tmpDir,{recursive:true,force:true}); } catch {}
    return null;
  }
  // Extract
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    if (tmpDir) {
      // apkToUse is inside tmpDir, need to unzip from there
      execSync(`unzip -p "${apkToUse}" "${iconPath}" > "${outPath}"`, { stdio: "ignore" });
      fs.rmSync(tmpDir,{recursive:true,force:true});
    } else {
      execSync(`unzip -p "${apkToUse}" "${iconPath}" > "${outPath}"`, { stdio: "ignore" });
    }
    return outPath;
  } catch {
    if (tmpDir) try { fs.rmSync(tmpDir,{recursive:true,force:true}); } catch {}
    return null;
  }
}

// --- CLI ---
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log(`apk-deep-links — extract & validate Android deep links (+ full APK metadata)
Usage:
  npx tsx scripts/apk-deep-links.ts extract <apkOrAppId> [--json] [--deep-only] [--full] [--apk <path>]
  npx tsx scripts/apk-deep-links.ts extract-icon <apkOrAppId> [--out <path>]  # extract launcher icon from APK (better than Play Store)
  npx tsx scripts/apk-deep-links.ts validate [--apk <apkOrAppId>] [--service <id>] [--json]
  npx tsx scripts/apk-deep-links.ts download <appId> [--out <dir>]
  npx tsx scripts/apk-deep-links.ts registry [--out <file>]  # leverage all data → markdown registry for all downloaded APKs

Examples:
  npx tsx scripts/apk-deep-links.ts extract com.moviebase --full --json
  npx tsx scripts/apk-deep-links.ts extract-icon downloads/com.moviebase.xapk --out /tmp/icon.png
  npx tsx scripts/apk-deep-links.ts extract ./downloads/com.moviebase.apk --json
  npx tsx scripts/apk-deep-links.ts validate --service moviebase
  npx tsx scripts/apk-deep-links.ts validate --apk ./downloads/com.moviebase.apk
  mise run apk:extract -- com.moviebase -- --full
  mise run apk:validate`);
    process.exit(0);
  }

  if (cmd === "extract-icon") {
    const input = args[1];
    const outIdx = args.indexOf("--out");
    const outPath = outIdx !== -1 ? args[outIdx+1] : null;
    if (!input) { console.error("extract-icon requires <apkOrAppId>"); process.exit(1); }
    let apkPath = resolveApk(input);
    if (!apkPath && /^[a-z][a-z0-9_.]+$/.test(input)) {
      console.error(`[*] APK not found locally for ${input}, attempting download ...`);
      const dl = await downloadApk(input);
      if (dl) apkPath = dl;
    }
    if (!apkPath || !fs.existsSync(apkPath)) {
      console.error(`[-] APK not found for "${input}"`);
      process.exit(1);
    }
    const out = outPath ?? `assets/apps/images/${path.basename(apkPath).replace(/\.(apk|xapk)$/,"")}/assets/play_store.png`;
    console.error(`[*] extracting icon from ${apkPath} → ${out} ...`);
    const res = await extractIconToFile(apkPath, out);
    if (res) {
      console.log(res);
      process.exit(0);
    } else {
      console.error(`[-] No launcher icon found in ${apkPath}`);
      process.exit(1);
    }
  }

  if (cmd === "extract") {
    const input = args[1];
    const json = args.includes("--json");
    const deepOnly = args.includes("--deep-only");
    const apkFlagIdx = args.indexOf("--apk");
    const apkFromFlag = apkFlagIdx !== -1 ? args[apkFlagIdx + 1] : null;
    const target = apkFromFlag ?? input;
    if (!target) { console.error("extract requires <apkOrAppId>"); process.exit(1); }

    let apkPath = resolveApk(target);
    if (!apkPath) {
      // try as appId download
      const maybeAppId = target;
      if (/^[a-z][a-z0-9_.]+$/.test(maybeAppId)) {
        console.error(`[*] APK not found locally for ${maybeAppId}, attempting download ...`);
        const dl = await downloadApk(maybeAppId);
        if (dl) apkPath = dl;
      }
    }
    if (!apkPath || !fs.existsSync(apkPath)) {
      console.error(
        `[-] APK not found for "${target}".\n` +
        `    Provide a path: npx tsx scripts/apk-deep-links.ts extract ./path/to/app.apk\n` +
        `    Or install apkeep and run: apkeep -a ${target} downloads/`
      );
      process.exit(1);
    }

    console.error(`[*] extracting manifest from ${apkPath} ...`);
    const xml = await extractManifestXml(apkPath);
    const filters = parseManifestXml(xml);
    const deep = filters.filter(isDeepLink);
    const toShow = deepOnly ? deep : filters;
    const full = args.includes("--full");

    if (full) {
      const meta = extractFullMetadata(xml, apkPath, filters);
      if (json) {
        console.log(JSON.stringify({ apk: apkPath, ...meta, totalFilters: filters.length, deepLinkFilters: deep.length, appLinkFilters: filters.filter(f=>f.autoVerify).length, filters: toShow }, null, 2));
      } else {
        console.log(`\nAPK: ${apkPath}`);
        console.log(`Package: ${meta.package}  v${meta.versionName} (${meta.versionCode})  SDK ${meta.compileSdk}/${meta.targetSdk}  ${meta.apkSize}`);
        console.log(`Deep links: ${deep.length}/${filters.length}  App Links: ${meta.deepLinks.appLinks}  Custom: [${meta.deepLinks.customSchemes.join(", ")}]`);
        console.log(`Permissions: ${meta.permissionsCount} [${meta.permissions.join(", ")}]`);
        console.log(`Queries: ${meta.queries.packagesCount} pkgs [${meta.queries.packages.join(", ")}]  ${meta.queries.intentsCount} intents`);
        console.log(`Exported: ${meta.exportedComponentsCount} components`);
        console.log("");
        for (const f of toShow) {
          const tag = isDeepLink(f) ? "[DEEP LINK]" : "[other]";
          console.log(`${tag} ${f.component_type} ${f.component_name}${f.autoVerify?" [autoVerify]":""}`);
          for (const d of f.data) {
            const parts = Object.entries(d).filter(([,v])=>v).map(([k,v])=>`${k}=${v}`).join(", ");
            if (parts) console.log(`  data: ${parts}`);
          }
        }
        console.log("\n--- Deep link URIs ---");
        for (const l of formatDeepLinks(deep)) console.log(l);
        console.log("\n--- Full meta (json) ---");
        console.log(JSON.stringify(meta, null, 2));
      }
      process.exit(0);
    }

    if (json) {
      console.log(JSON.stringify({ apk: apkPath, totalFilters: filters.length, deepLinkFilters: deep.length, filters: toShow }, null, 2));
    } else {
      console.log(`\nAPK: ${apkPath}`);
      console.log(`Total intent-filters: ${filters.length}  |  Deep links (VIEW+BROWSABLE+data): ${deep.length}\n`);
      if (toShow.length === 0) {
        console.log("(no matching intent-filters)");
      } else {
        for (const f of toShow) {
          const tag = isDeepLink(f) ? "[DEEP LINK]" : "[other]";
          console.log(`${tag} ${f.component_type} ${f.component_name}`);
          console.log(`  actions: ${f.actions.join(", ") || "(none)"}`);
          console.log(`  categories: ${f.categories.join(", ") || "(none)"}`);
          if (f.data.length) {
            for (const d of f.data) {
              const parts = Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(", ");
              console.log(`  data: ${parts || "(empty)"}`);
            }
          }
          if (f.autoVerify) console.log(`  autoVerify: true`);
          console.log();
        }
        console.log("--- Deep link URIs ---");
        for (const l of formatDeepLinks(deep)) console.log(l);
      }
    }
    process.exit(0);
  }

  if (cmd === "registry") {
    // Leverage all data: generate markdown registry for all downloaded APKs + all services
    const outIdx = args.indexOf("--out");
    const outFile = outIdx !== -1 ? args[outIdx+1] : "DEEP_LINK_REGISTRY.md";
    const dlDir = "downloads";
    const apkFiles = fs.existsSync(dlDir) ? fs.readdirSync(dlDir).filter(f=>f.endsWith(".apk")||f.endsWith(".xapk")).map(f=>path.join(dlDir,f)) : [];
    // Also include any apk passed via --apk?
    const lines: string[] = [];
    lines.push(`# Deep Link Registry — Real APK Analysis`);
    lines.push(`Generated: ${new Date().toISOString()} via \`apk-deep-links.ts extract --full\``);
    lines.push(`Source: ${apkFiles.length} APKs in \`${dlDir}\` (apkeep apk-pure) + 48 services in \`src/data/services\``);
    lines.push(``);
    lines.push(`## Summary`);
    lines.push(`| Service | Package | Ver | Size | Deep | AppLinks | Custom | Hosts | Valid |`);
    lines.push(`|---|---|---|---|---|---|---|---|---|`);
    const services = (()=>{ try { return loadServices(); } catch { return []; } })();
    const svcMap = new Map(services.map(s=>[s.androidAppId,s.id]));
    for (const apk of apkFiles.sort()) {
      try {
        const xml = await extractManifestXml(apk);
        const filters = parseManifestXml(xml);
        const meta = extractFullMetadata(xml, apk, filters);
        const sid = svcMap.get(meta.package) ?? meta.package ?? "?";
        // validate
        let valid = "?";
        try {
          const res = await (async()=>{
            // quick validate without re-extract
            const svc = services.find(s=>s.id===sid);
            if (!svc) return "?";
            // reuse validate logic simplified: check scheme
            return "✓";
          })();
          valid = res;
        } catch {}
        // Actually run validate via function
        let vErrors = 0;
        try {
          const tmp = await (async()=>{
            const { execSync } = await import("node:child_process");
            const out = execSync(`npx tsx scripts/apk-deep-links.ts validate --apk "${apk}" --service "${sid}" --json`, {encoding:"utf-8", timeout:10000});
            return JSON.parse(out);
          })();
          vErrors = tmp.errors ?? 0;
          valid = vErrors===0 ? "✓" : `✗ ${vErrors}`;
        } catch { valid = "?" }
        lines.push(`| ${sid} | \`${meta.package}\` | ${meta.versionName} | ${meta.apkSize} | ${meta.deepLinks.deepLinkFilters} | ${meta.deepLinks.appLinks} | ${meta.deepLinks.customSchemes.join(",")||"-"} | ${meta.deepLinks.hosts.slice(0,3).join(",")||"-"} | ${valid} |`);
      } catch (e:any) {
        lines.push(`| ? | \`${apk}\` | - | - | - | - | - | error |`);
      }
    }
    lines.push(``);
    lines.push(`## Per-APK Details (full --full)`);
    for (const apk of apkFiles.sort()) {
      try {
        const xml = await extractManifestXml(apk);
        const filters = parseManifestXml(xml);
        const meta = extractFullMetadata(xml, apk, filters);
        const deep = filters.filter(isDeepLink);
        lines.push(`### ${meta.package} — ${apk}`);
        lines.push(`- Ver: ${meta.versionName} (${meta.versionCode}), SDK ${meta.compileSdk}, size ${meta.apkSize}`);
        lines.push(`- Deep links: ${deep.length}/${filters.length} (AppLinks ${meta.deepLinks.appLinks})`);
        lines.push(`- Custom: ${meta.deepLinks.customSchemes.join(", ")||"-"} | Hosts: ${meta.deepLinks.hosts.join(", ")||"-"}`);
        lines.push(`- Perms: ${meta.permissionsCount} | Queries pkgs: ${meta.queries.packagesCount} [${meta.queries.packages.slice(0,5).join(", ")}]`);
        if (deep.length) {
          lines.push(`- URIs:`);
          for (const l of formatDeepLinks(deep).slice(0,10)) lines.push(`  - \`${l}\``);
        }
        lines.push(``);
      } catch {}
    }
    lines.push(`## Service Coverage`);
    const withApp = services.filter(s=>s.androidAppId).length;
    const withoutApp = services.length - withApp;
    const downloadedPkgs = new Set(apkFiles.map(p=> {
      // apk file stem is package, but xapk may be same
      const base = path.basename(p).replace(/\.(apk|xapk)$/,"");
      return base;
    }));
    const missing = services.filter(s=>s.androidAppId && !downloadedPkgs.has(s.androidAppId)).map(s=>s.id);
    lines.push(`- Services with androidAppId: ${withApp}, web-only: ${withoutApp}, downloaded: ${downloadedPkgs.size}, missing (Play-only): ${missing.join(", ")||"none"}`);
    fs.writeFileSync(outFile, lines.join("\n"));
    console.log(`[✓] Registry written to ${outFile} (${apkFiles.length} APKs)`);
    process.exit(0);
  }

  if (cmd === "validate") {
    const apkIdx = args.indexOf("--apk");
    const apkInput = apkIdx !== -1 ? args[apkIdx + 1] : null;
    const svcIdx = args.indexOf("--service");
    const svcId = svcIdx !== -1 ? args[svcIdx + 1] : undefined;
    const json = args.includes("--json");

    let apkFilters: IntentFilter[] | undefined;
    if (apkInput) {
      let apkPath = resolveApk(apkInput);
      if (!apkPath) {
        const dl = await downloadApk(apkInput);
        if (dl) apkPath = dl;
      }
      if (!apkPath || !fs.existsSync(apkPath)) {
        console.error(`[-] APK not found for validate: ${apkInput}`);
        process.exit(1);
      }
      const xml = await extractManifestXml(apkPath);
      apkFilters = parseManifestXml(xml);
      if (!json) console.error(`[*] loaded ${apkFilters.length} filters from ${apkPath} (${apkFilters.filter(isDeepLink).length} deep links)`);
    }
    const code = validateServices({ apkFilters, serviceId: svcId, json });
    process.exit(code);
  }

  if (cmd === "download") {
    const appId = args[1];
    const outIdx = args.indexOf("--out");
    const outDir = outIdx !== -1 ? args[outIdx + 1] : "downloads";
    if (!appId) { console.error("download requires <appId>"); process.exit(1); }
    const p = await downloadApk(appId, outDir);
    if (p) { console.log(p); process.exit(0); }
    else { console.error(`[-] download failed for ${appId}. Install apkeep: https://github.com/EFForg/apkeep`); process.exit(1); }
  }

  console.error(`unknown command: ${cmd}`);
  process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
