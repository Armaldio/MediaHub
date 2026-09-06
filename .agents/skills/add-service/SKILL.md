---
name: add-service
description: Add a new streaming/tracker service to MediaHub — creates service file, fetches icons, extracts and validates deep links from real APK. Trigger when user says "add service", "new service", "add provider", "integrate <app>" or mentions a new app to open media with.
---

# Add Service

Creates a complete MediaHub service (tracker/streamer) with icons and verified deep links.

## When to use

- User wants to open movies/shows with a new app (Plex, Jellyfin, *arr, Letterboxd-like, etc.)
- `id`, `androidAppId` or `websiteUrl` is mentioned
- Need to scaffold `src/data/services/<id>.ts` and register it

## Pre-flight

1. Resolve `id` — kebab-case, matches `Service.id` (`simkl` not `Simkl`). If package `com.foo.bar`, suggest `foo` as id.
2. Collect:
   - `name` (display), `description`
   - `websiteUrl` (`https://...`)
   - `androidAppId` (`com.foo.bar` — optional but required for `requiresApp` deep links)
   - `color` (brand hex, fallback `#6366F1`)
   - `supportsCustomInstances` (true for self-hosted: Plex/Jellyfin/*arr — then `customInstances: []`)

If missing, ask once; don't guess.

## Ladder (ponytail)

1. **Reuse** — check `src/data/services/*.ts` for existing pattern (`plex.ts` for custom instances, `trakt.ts` for slug, `simkl.ts` for simple). Copy the closest.
2. **Stdlib** — no new deps. Use existing `tsx`, `apk-deep-links.ts`, `download-app-images`.

## Steps

### 1. Scaffold `src/data/services/<id>.ts`

Template (adapt from `src/data/services/trakt.ts` / `plex.ts`):

```ts
import <id>Icon from "../../assets/apps/images/<id>/assets/play_store.png";
import { Service } from "../../types/index";

export const <id>: Service = {
  id: "<id>",
  name: "<Name>",
  description: "<...>",
  icon: <id>Icon,
  websiteUrl: "https://...",
  appUrl: "https://play.google.com/store/apps/details?id=<androidAppId>",
  androidAppId: "<androidAppId>", // "" if web-only
  color: "#XXXXXX",
  // for self-hosted: supportsCustomInstances: true, customInstances: [],
  deepLinks: [
    {
      name: "App",
      mediaType: "movie", // "movie" | "tv" | "all"
      enabled: (data) => data.type === "movie" && !!data.<requiredId>,
      url: (data) => `scheme://host/${data.<requiredId>}`, // validated via apk
      requiresApp: true,
    },
    {
      name: "Website",
      mediaType: "movie",
      enabled: (data) => data.type === "movie" && !!data.<requiredId>,
      url: (data) => `https://.../${data.<requiredId>}`,
    },
  ],
};
```

**Rules:**
- `tmdbId` is always present (`FormattedDetails.tmdbId: string`) — no guard needed.
- All other `*Id` (`imdbId`, `tvdbId`, `letterboxdId`, `traktSlug`, etc.) are optional → guard `&& !!data.<id>`.
- `requiresApp:true` only if `androidAppId` non-empty.
- `mediaType` must match `enabled` filter.

### 2. Fetch icons (APK first, Play Store fallback)

```bash
# Best: extract from real APK (exact, offline, no Playwright)
npx tsx scripts/apk-deep-links.ts extract-icon downloads/<package>.xapk --out src/assets/apps/images/<id>/assets/play_store.png
# Or bulk for all downloaded APKs:
for apk in downloads/*.apk downloads/*.xapk; do npx tsx scripts/apk-deep-links.ts extract-icon "$apk" --out "src/assets/apps/images/$(basename $apk .apk)/assets/play_store.png"; done

# Fallback: Play Store / favicon (needs Playwright, network)
pnpm run download-app-images  # now tries APK first, then Play Store, then favicon
```

If APK not in `downloads/` (Play-only apps: `crunchyroll`, `dubbingbase`, `emby`), it falls back to Play Store scraping via Playwright, then `favicon.png` from `websiteUrl`. Verify `assets/apps/images/<id>/assets/play_store.png` exists. For Play-only, `mise run apk:download -- <pkg> -d huawei-app-gallery` may succeed (e.g., `plex` via Huawei), else manual APK needed.

### 3. Extract & validate deep links from real APK (required)

```bash
# Download (needs apkeep, fallback to apk-pure; Play-only needs manual APK)
mise run apk:download -- <androidAppId>                  # → downloads/<package>.apk/.xapk
mise run apk:extract -- <androidAppId> -- --full --json  # → manifest deepLinks, perms, queries, App Links
# Or direct file:
npx tsx scripts/apk-deep-links.ts extract downloads/<package>.xapk --full --json | jq .deepLinks

# Validate service definition against real manifest (scheme+host, @string/ resolved, Netflix regex fallback)
mise run apk:validate -- --service <id>                          # generic (no APK, checks guards)
mise run apk:validate -- --service <id> --apk downloads/<package>.xapk  # real APK (checks scheme/host)
```

**What the data means:**
- `customSchemes` vs `AppLinks` (`autoVerify=true` + `https`): Many apps (Apple TV `com.apple.atve.sony.appletv`, Max `com.wbd.stream`, Letterboxd `com.letterboxd.letterboxd`) declare *only* `https://tv.apple.com` / `https://letterboxd.com` — no `apple-tv://`/`max://`/`letterboxd://`. Use `https://...` for both App and Website, `requiresApp:true` for the App Link variant.
- `@string/deeplink_scheme` → resolved via `res/values/strings.xml` (e.g., `allocine` from `com.allocine.androidapp`).
- `pathPrefix`/`pathPattern` matter: `betaseries://show` not `shows`, `simkl` → `simkllists`.

Fix service `url:` to match `apk-deep-links.ts extract --full` hosts. Re-run validate until `✓ 0 errors`.

### 4. Register

Add to `src/data/services.ts`:

```ts
import { <id> } from "./services/<id>";
// ...
export default [ ..., <id>, ] satisfies Service[];
```

### 5. Verify

```bash
mise run apk:validate -- --service <id> --apk downloads/<package>.xapk  # real APK
mise run apk:validate -- --service <id>                        # generic
pnpm run check  # vue-tsc
```

Registry: `npx tsx scripts/apk-deep-links.ts registry --out DEEP_LINK_REGISTRY.md` (leverages all 26 APKs).

## Anti-patterns

- Don't invent `custom://` schemes — extract from APK first.
- Don't add `&& !!data.tmdbId` (always present).
- Don't add per-service mise tasks — use `apk:validate:all` / `--service <id>`.

## Example: Add `crunchyroll` (failed on apk-pure, needs manual APK)

```bash
# 1. Scaffold src/data/services/crunchyroll.ts with id=crunchyroll, androidAppId=com.crunchyroll.crunchyroid
# 2. pnpm run download-app-images
# 3. Manual APK → downloads/com.crunchyroll.crunchyroid.apk, then:
npx tsx scripts/apk-deep-links.ts extract downloads/com.crunchyroll.crunchyroid.apk --full --json
npx tsx scripts/apk-deep-links.ts validate --service crunchyroll --apk downloads/com.crunchyroll.crunchyroid.apk
```
