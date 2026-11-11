# Service link audit

Scope: 49 registered services, shared Details filtering/instance handling, provider-ID enrichment, and Seerr request API behavior. The generic validator checks definition shape and guards; it does not verify live destinations or native app routes.

## Inventory

All rows passed `mise run apk:validate -- --json` (0 errors, 0 warnings). No `downloads/` directory or APKs were present, so native intent schemes and app-link filters could not be compared with manifests. Unless a row is marked below, live route behavior remains unverified in this audit.

| Service | Audit result |
| --- | --- |
| Netflix | Generic validation passed; live route and APK manifest not checked |
| Prime Video | Generic validation passed; live route and APK manifest not checked |
| Disney+ | Fixed: missing provider ID no longer creates an app/web link; live route still unverified |
| Max | Generic validation passed; live route and APK manifest not checked |
| Apple TV+ | Fixed: TMDB IDs are no longer used as Apple content IDs; live route still unverified |
| Paramount+ | Fixed: app links no longer substitute TMDB IDs for Paramount+ IDs; native route still unverified |
| Moviebase | Generic validation passed; live route and APK manifest not checked |
| Letterboxd | Generic validation passed; live route and APK manifest not checked |
| Trakt | Generic validation passed; live route and APK manifest not checked |
| JustWatch | Generic validation passed; live route and APK manifest not checked |
| IMDb | Generic validation passed; live route and APK manifest not checked |
| Wikidata | Generic validation passed; live route and APK manifest not checked |
| Plex | Generic validation passed; instance links and live server not checked |
| Jellyfin | Generic validation passed; instance links and live server not checked |
| Kodi | Generic validation passed; live route and APK manifest not checked |
| AVA Assistant | Generic validation passed; live route and APK manifest not checked |
| YouTube | Generic validation passed; live route and APK manifest not checked |
| MUBI | Generic validation passed; live route and APK manifest not checked |
| Simkl | Generic validation passed; live route and APK manifest not checked |
| TMDB | Generic validation passed; live route and APK manifest not checked |
| TVDB | Generic validation passed; live route and APK manifest not checked |
| AlloCiné | Generic validation passed; movie link uses P1265 and its Wikidata formatter URL; native schemes disabled as unverified |
| BetaSeries | Generic validation passed; live route and APK manifest not checked |
| DubbingBase | Generic validation passed; live route and APK manifest not checked |
| NZB360 | Generic validation passed; live route and APK manifest not checked |
| Seerr | Fixed: multiple configured instances, request payload/matching, per-title availability, no-key navigation, and TV detail route; live server/CORS not tested |
| Sonarr | Generic validation passed; instance links and live server not checked |
| Radarr | Generic validation passed; instance links and live server not checked |
| Rotten Tomatoes | Generic validation passed; identifier is now populated from Wikidata P1258; live route unverified |
| Metacritic | Generic validation passed; P1712 prefixed identifier now goes directly to its path; live route unverified |
| AniList | Generic validation passed; identifier is now populated from Wikidata P8729; live route unverified |
| Emby | Generic validation passed; instance links and live server not checked |
| TVmaze | Generic validation passed; live route and APK manifest not checked |
| Peacock | Generic validation passed; identifier is now populated from Wikidata P11815; live route unverified |
| Hulu | Generic validation passed; movie/series identifiers are populated separately from Wikidata P6466/P6467; live routes unverified |
| Crunchyroll | Generic validation passed; series identifier is now populated from Wikidata P11330; live route unverified |
| Kinopoisk | Generic validation passed; identifier is now populated from Wikidata P2603; live route unverified |
| Douban | Generic validation passed; identifier is now populated from Wikidata P4529; live route unverified |
| FilmAffinity | Generic validation passed; identifier is now populated from Wikidata P480; live route unverified |
| ČSFD | Generic validation passed; identifier is now populated from Wikidata P2529; live route unverified |
| iTunes | Generic validation passed; movie identifier is now populated from Wikidata P6398; live route unverified |
| Google Play | Generic validation passed; no verified provider-ID property found in this audit |
| SensCritique | Generic validation passed; no verified provider-ID property found in this audit |
| AllMovie | Generic validation passed; identifier is now populated from Wikidata P1562; live route unverified |
| Filmweb | Generic validation passed; P5032 numeric identifier uses its `/film?Id=` formatter; live route unverified |
| Box Office Mojo | Generic validation passed; movie identifier is now populated from Wikidata P1237; current destination route remains unverified |
| Filmarks | Generic validation passed; no verified provider-ID property found in this audit |
| Floppy | Generic validation passed; live instance/CORS behavior not tested |
| Yamtrack | Generic validation passed; live instance/CORS behavior not tested |

## Changes and evidence

- Wikidata identifiers are fetched in one `wbgetentities` request and extracted from the claim `mainsnak.datavalue.value`. The property mappings correspond to Wikidata properties [P1258](https://www.wikidata.org/wiki/Property:P1258), [P1712](https://www.wikidata.org/wiki/Property:P1712), [P8729](https://www.wikidata.org/wiki/Property:P8729), [P11815](https://www.wikidata.org/wiki/Property:P11815), [P6466](https://www.wikidata.org/wiki/Property:P6466), [P6467](https://www.wikidata.org/wiki/Property:P6467), [P11330](https://www.wikidata.org/wiki/Property:P11330), [P2603](https://www.wikidata.org/wiki/Property:P2603), [P4529](https://www.wikidata.org/wiki/Property:P4529), [P480](https://www.wikidata.org/wiki/Property:P480), [P2529](https://www.wikidata.org/wiki/Property:P2529), [P6398](https://www.wikidata.org/wiki/Property:P6398), [P1562](https://www.wikidata.org/wiki/Property:P1562), [P1265](https://www.wikidata.org/wiki/Property:P1265), [P5032](https://www.wikidata.org/wiki/Property:P5032), and [P1237](https://www.wikidata.org/wiki/Property:P1237). Google Play, SensCritique, and Filmarks remain without guessed mappings.
- Seerr request status `2` means approved; availability is separate media status `5`. The integration queries the title detail endpoint (`/api/v1/movie/:id` or `/api/v1/tv/:id`) and reads `mediaInfo.status` plus that title’s requests, avoiding a first-50 request scan. See [request body and response types](https://github.com/seerr-team/seerr/blob/develop/server/interfaces/api/requestInterfaces.ts), [status constants](https://github.com/seerr-team/seerr/blob/develop/server/constants/media.ts), [movie route](https://github.com/seerr-team/seerr/blob/develop/server/routes/movie.ts), and [TV route](https://github.com/seerr-team/seerr/blob/develop/server/routes/tv.ts). Status lookup runs before Wikidata enrichment, so titles without a Wikidata entity are still checked. Instances without an API key open the matching Seerr title page instead of showing an inert request button.
- AlloCiné now uses its movie ID (P1265) and [the Wikidata formatter](https://www.wikidata.org/wiki/Property:P1265); unverified native schemes were removed. Paramount+ app actions no longer substitute TMDB IDs for Paramount IDs. [Metacritic P1712](https://www.wikidata.org/wiki/Property:P1712) values include `movie/` or `tv/` prefixes and now go directly after the domain. [Filmweb P5032](https://www.wikidata.org/wiki/Property:P5032) is numeric and formats as `/film?Id=$1`.
- Per-instance Seerr health/API behavior is not proven against a live server. Browser CORS, credentials, server versions, and route availability remain deployment-specific.

## Verification limits

The machine has no downloaded APKs. A bounded AlloCiné package download attempt failed because `apkeep` is not installed; the runner reported `Install apkeep: https://github.com/EFForg/apkeep`. Existing static generic validation therefore confirms only that definitions and their guards are structurally valid; it does not validate package deep links. Wikidata may not have a claim for every title, so provider links remain absent when claims are missing. The Context7 Wikibase API index had no matching response-shape documentation; mapping was checked against the live Wikidata API response format and property pages.
