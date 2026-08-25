# MediaHub

## 1.0.23

### Patch Changes

- Fix service chooser always showing on launch and rename app to MediaHub

  Move loadFromLocalStorage() before async checkInstalledApps() so the
  router guard sees persisted selections immediately. Also rename the
  user-facing app name from "Movie Hub" to "MediaHub" across all UI text.

## 1.0.22

### Patch Changes

- Fix app deep link install detection and gate links by install status

  App deep links (custom scheme like imdb://) are now hidden when the native app
  isn't installed, while web links always show. Install detection now uses the
  deep-link URI scheme via AppLauncher.canOpenUrl instead of the package name,
  which never resolved on Android.

## 1.0.21

### Patch Changes

- Fix Android `versionCode` being hardcoded, which made every build reuse the same Play Store version code and fail the upload (`Version code 1000018 has already been used`). The Android version is now derived from `package.json`.

## 1.0.20

### Patch Changes

- ## Quick win fixes & service improvements

  - Removed duplicate API calls on Details mount (double `onMounted`)
  - Uncommented safe-area CSS so mobile layouts render correctly
  - Split the shared `loading` flag into per-operation flags (fixes spinner race condition)
  - Extracted the 8 repeated Wikidata fetches into a reusable `fetchWikidataProperty` helper (parallelized)
  - Deduplicated `loadFromLocalStorage` calls on startup
  - Moved TVDB data enrichment out of `data/services.ts` into a `useTVDBData` composable
  - Fixed deep links: MUBI TV, JustWatch (TV + website), AlloCiné (website), DubbingBase (website), IMDb TV, and Plex/Jellyfin/Kodi instance-aware links
  - Added a `category` field to services and null-guards on deep links that reference `tmdbId`
  - Removed debug `console.log` output (including auth-token leaks) and hardened types
  - Switched the release process to Changesets
