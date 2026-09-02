# Agent notes

## Releasing
- Bump **both** `package.json` (version) AND `android/app/build.gradle` (`versionCode` + `versionName`)
  - `versionName` in Android should match `version` in package.json
  - `versionCode` must be unique per Play Store release — Android error: `Version code X has already been used`
  - v1.2.0 used versionCode 1001003; v1.1.2 used 1001002
- CI pipeline: Android Build → Upload .aab to Google Play → Update internal track
- When CI fails on `versionCode already used`, bump both `versionCode` and `versionName` in `android/app/build.gradle`

## TMDB external IDs
- TMDB `GET /{movie,tv}/{id}?append_to_response=external_ids` returns `external_ids.trakt` and `external_ids.wikidata_id`
- Use `external_ids.trakt` (numeric ID) to fetch slug from `GET https://api.trakt.tv/{movies,shows}/{traktId}` with `trakt-api-key` header
- Wikidata property `P1232` holds the Trakt ID on a media entity

## Jellyfin item lookup
- Old: `GET /Items?Recursive=true&Fields=ProviderIds` → O(n) client-side scan
- New: `GET /Search/Hints?searchTerm={title}&isMovie|isSeries=true&limit=10` → server-side search, ~10 results
- If hints return nothing, fall back to the full scan via `ProviderIds.Tmdb`
- Jellyfin returns `ItemId` in hints response (not `Id`)

## Trakt deep links
- Trakt slugs are `{slug}` or `{slug}-{year}`, NOT bare TMDB IDs
- Fetch real slug via TMDB external_ids → Trakt API; fall back to local slugify
- Trakt URL format: `https://trakt.tv/{movies,shows}/{slug}` and `trakt://{movie,show}/{slug}`
