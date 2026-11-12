# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

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

To run the browser regression for empty season and episode metadata, start the
dev server with `pnpm dev -- --host 127.0.0.1`, then run this in another
terminal (Playwright Chromium must be installed):

```sh
BASE_URL=http://127.0.0.1:5173 pnpm exec node scripts/test-tv-metadata.mjs
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if Chromium is installed at a custom path.
