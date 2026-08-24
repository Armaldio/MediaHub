# movie-hub-app

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
