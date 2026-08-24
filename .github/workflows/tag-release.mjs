// Creates a `vX.Y.Z` git tag for the current package version.
// Run by the changesets/action `publish` step; the action pushes the
// resulting tag (which triggers the Android build workflow).
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const pkgPath = "package.json";
const { version } = JSON.parse(readFileSync(pkgPath, "utf8"));
const tag = `v${version}`;

const existing = execSync("git tag --list", { encoding: "utf8" })
  .split("\n")
  .map((t) => t.trim());

if (existing.includes(tag)) {
  console.log(`Tag ${tag} already exists, skipping.`);
  process.exit(0);
}

console.log(`Creating tag ${tag}`);
execSync(`git tag -a ${tag} -m ${tag}`, { stdio: "inherit" });
