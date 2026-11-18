# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Local development

With Doppler installed and authenticated for the `dubbingbase` project, run:

```sh
mise run dev
```

This loads the `dev` config, maps the TMDB and TVDB credentials to the app's
`VITE_*` variables, and starts the app at http://127.0.0.1:5173 without an `.env` file.

## TV season and episode links

TV links can target a season or episode while keeping the show as the identity
for providers that only support show links:

```text
mediahub://show?tmdbId=SHOW_TMDB_ID&season=0&episode=1
mediahub://show?imdbId=EPISODE_IMDB_ID
```

Replace the example IDs with the TMDB show ID or IMDb episode ID you want to open.
Season `0` is TMDB's Specials season. When an IMDb ID identifies an episode,
MediaHub resolves the parent show and episode coordinates from TMDB. In the
details page, seasons and episodes are browsable. Links that support the
selected scope open that season or episode; other providers continue to open
the parent show.

Run `pnpm lint`, `pnpm check`, and `pnpm test:stores` for static checks and
store regressions.

To run the browser regression for empty season/episode metadata, enrichment
without Wikidata, and token logging, start the dev server with dummy credentials
(all API responses in this test are mocked):

```sh
VITE_TMDB_API_KEY=test VITE_TMDB_KEY=test VITE_TVDB_API_KEY=test VITE_TRAKT_CLIENT_ID=test pnpm dev --host 127.0.0.1
```

Then run this in another terminal (Playwright Chromium must be installed):

```sh
BASE_URL=http://127.0.0.1:5173 pnpm exec node scripts/test-tv-metadata.mjs
```

Run `BASE_URL=http://127.0.0.1:5173 node scripts/test-service-picker.mjs` to
check picker selection, keyboard reordering, saved choices, filters, and phone layouts.

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if Chromium is installed at a custom path.

Vue DevTools is opt-in to keep normal startup lean. Run
`VUE_DEVTOOLS=true pnpm dev` when you need the inspector.


## Android deep links

Use `mediahub://movie?tmdbId=100` or
`mediahub://show?tmdbId=200&season=1&episode=2` to open a title in the app.
The web app accepts the same parameters on `/movie` and `/show`.

Verified HTTPS App Links require a domain controlled by the project. The
previously configured `mediahub.app` is parked. To enable App Links, host the
web app and `/.well-known/assetlinks.json` on the project domain, include the
Google Play app signing certificate fingerprint for
`xyz.armaldio.mediahub.app`, and declare that host and the two paths in an
`android:autoVerify` intent filter. Update the accepted HTTPS origin in the
deep link parser to match.
