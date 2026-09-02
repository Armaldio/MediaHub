# Agent notes

## Releasing
- Use `mise` release functions (`release:stable`, `release:beta`) — they handle version bumping and Android `versionCode` automatically. **Do not** manually edit `android/app/build.gradle` or `package.json` for releases.
- If CI fails with `"Target SDK of artifact is too low"`, bump `targetSdkVersion` (and `compileSdkVersion`) in `android/variables.gradle` — Google Play requires the latest SDK. v1.2.0 required bumping from 35 to 36.

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
