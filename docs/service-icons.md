# Service icons

Service definitions import local artwork from `src/assets/apps/images`. Keep each
service's own brand mark, preserve its aspect ratio with `object-contain`, and use
an extension matching the actual encoding. Do not substitute another service's
icon or a fabricated text badge. Brand names and artwork belong to their owners.

## Artwork refreshed in November 2026

| Service | Source |
| --- | --- |
| Sonarr | https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/256.png |
| Radarr | https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/256.png |
| Seerr | https://raw.githubusercontent.com/seerr-team/seerr/develop/public/android-chrome-192x192.png |
| AllMovie | https://fastly-gce.allmovie.com/images/ios/AppIcon144x144.png |
| AniList | https://anilist.co/img/icons/apple-touch-icon.png |
| Douban | https://asset.doubanio.com/cuphead/movie-static/pics/apple-touch-icon.png |
| SensCritique | https://www.senscritique.com/app-icons/android-chrome-256x256.png |
| TVmaze | https://static.tvmaze.com/images/favico/favicon-192x192.png |
| TheTVDB | https://thetvdb.com/touch-icon-196x196.png |
| Wikidata | https://www.wikidata.org/static/apple-touch/wikidata.png |
| Peacock | https://www.peacocktv.com/static/peacock-toolkit/53.4.0/peacock/favicons/apple-touch-icon_180x180.png |
| iTunes Store | Apple's artwork returned by https://itunes.apple.com/lookup?id=915061235 (`artworkUrl512`) |
| FilmAffinity | https://icons.duckduckgo.com/ip3/www.filmaffinity.com.ico (cached site icon; direct site requests returned HTTP 403) |
| Box Office Mojo | https://www.boxofficemojo.com/favicon.ico (PNG response) |

Crunchyroll, Hulu, and Google Play use their existing Play Store artwork. Emby,
Rotten Tomatoes, Metacritic, Filmweb, Filmarks, and ČSFD use their existing site
icons instead of fabricated letter badges. The ČSFD and Filmarks ICO artwork
was converted to PNG for reliable decoding across browsers. The remaining service artwork was
visually reviewed and retained.

The picker regression script decodes every catalog image, including lazy images,
and checks that services do not share an icon URL. Run it as documented in the
README. Visual inspection is still necessary to confirm brand identity.
