import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:5173";
const screenshots = process.env.SCREENSHOT_DIR;
if (screenshots) await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});

try {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 900 },
  });
  await context.addInitScript(() => {
    if (!localStorage.getItem("servicesState"))
      localStorage.setItem(
        "servicesState",
        JSON.stringify({
          selectedServiceIds: ["imdb", "the_movie_database", "sonarr-library", "netflix"],
          customInstances: {
            sonarr: [
              {
                id: "library",
                name: "My library",
                baseUrl: "https://library.example.test",
                apiKey: "test-key",
                isDefault: true,
              },
            ],
          },
        })
      );
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);
  page.setDefaultNavigationTimeout(60_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const movie = {
    id: 100,
    title: "A quiet adventure",
    media_type: "movie",
    release_date: "2024-04-12",
    vote_average: 8.2,
    poster_path: null,
    overview: "An unexpected journey brings a group of old friends together.",
    genres: [{ id: 1, name: "Adventure" }],
    runtime: 108,
    external_ids: { imdb_id: "tt100", wikidata_id: "Q100", tvdb_id: null },
  };
  const episode = {
    id: 701,
    name: "The beginning",
    episode_number: 1,
    season_number: 1,
    air_date: "2024-04-12",
    overview: "The first chapter of a new story.",
    vote_average: 8,
    runtime: 42,
    still_path: null,
    external_ids: {},
  };
  const show = {
    ...movie,
    id: 200,
    title: undefined,
    name: "A longer story",
    media_type: "tv",
    first_air_date: "2024-04-12",
    seasons: [
      { id: 700, season_number: 1, name: "Season 1", episode_count: 1 },
    ],
    number_of_seasons: 1,
    number_of_episodes: 1,
  };
  let releaseEntry;
  let releaseStyles;
  let markStylesRequested;
  const stylesRequested = new Promise(resolve => { markStylesRequested = resolve; });
  const stylesReady = new Promise(resolve => { releaseStyles = resolve; });
  await page.route(/\/(src\/style\.css|assets\/style-[^/]+\.css)(\?.*)?$/, async (route) => {
    markStylesRequested();
    await stylesReady;
    await route.continue();
  });

  const entryReady = new Promise(resolve => { releaseEntry = resolve; });
  await page.route(/\/(src\/main\.ts|assets\/index-[^/]+\.js)(\?.*)?$/, async (route) => {
    await entryReady;
    await route.continue();
  });

  let releaseMovies;
  let releaseTv;
  let releaseDetails;
  let releaseProvider;
  let releaseSeason;
  let holdSeason = false;
  const moviesReady = new Promise(resolve => { releaseMovies = resolve; });
  const tvReady = new Promise(resolve => { releaseTv = resolve; });
  const detailsReady = new Promise(resolve => { releaseDetails = resolve; });
  const providerReady = new Promise(resolve => { releaseProvider = resolve; });
  const seasonReady = new Promise(resolve => { releaseSeason = resolve; });
  const popularMovies = [movie, ...Array.from({ length: 11 }, (_, i) => ({
    ...movie, id: 300 + i, title: `Another adventure ${i + 1}`,
  }))];

  await page.route("https://api.themoviedb.org/**", async (route) => {
    const { pathname, searchParams } = new URL(route.request().url());
    if (pathname.endsWith("/search/multi")) {
      if (searchParams.get("query") === "offline") return route.fulfill({ status: 500, json: {} });
      return route.fulfill({
        json: {
          results: searchParams.get("query") === "nothing" ? [] : [movie, show],
        },
      });
    }
    if (pathname.endsWith("/tv/200/season/1/episode/1"))
      return route.fulfill({ json: episode });
    if (pathname.endsWith("/tv/200/season/1")) {
      if (holdSeason) await seasonReady;
      return route.fulfill({
        json: {
          id: 700,
          name: "Season 1",
          season_number: 1,
          overview: "A new story.",
          episodes: [episode],
          external_ids: {},
        },
      });
    }
    if (pathname.endsWith("/movie/100")) {
      await detailsReady;
      return route.fulfill({ json: movie });
    }
    if (pathname.endsWith("/tv/200")) return route.fulfill({ json: show });
    if (pathname.endsWith("/tv/popular")) await tvReady;
    if (pathname.endsWith("/movie/popular")) await moviesReady;
    const results = pathname.includes("/tv/popular")
      ? [show]
      : pathname.includes("/trending/")
      ? [movie, show]
      : popularMovies;
    return route.fulfill({ json: { results } });
  });
  await page.route("https://www.wikidata.org/w/api.php?**", async (route) => {
    await providerReady;
    await route.fulfill({ json: {
      entities: { Q100: { claims: { P1874: [{ mainsnak: { datavalue: { value: "123456" } } }] } } },
    } });
  });
  await page.route("https://library.example.test/**", (route) =>
    route.fulfill({ json: { version: "4.0" } })
  );

  async function fitsViewport(label) {
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      metrics.scrollWidth <= metrics.width,
      `${label}: no horizontal overflow (${metrics.scrollWidth}/${metrics.width})`
    );
  }
  async function capture(name) {
    if (screenshots)
      await page.screenshot({
        path: `${screenshots}/${name}.png`,
        fullPage: true,
      });
  }

  await page.goto(`${baseUrl}/home`, { waitUntil: "commit" });
  await page.getByRole("status", { name: "Loading MediaHub" }).waitFor();
  releaseEntry();
  await stylesRequested;
  await page.getByRole("status", { name: "Loading MediaHub" }).waitFor();
  releaseStyles();
  await page.getByRole("searchbox", { name: "Search movies and TV shows" }).waitFor();
  await page.getByRole("status", { name: "Loading popular movies" }).waitFor();
  const tvHeading = page.getByRole("heading", { name: "Popular TV shows" });
  const tvBefore = await tvHeading.boundingBox();
  releaseMovies();
  await page
    .getByRole("button", { name: "Open A quiet adventure", exact: true })
    .first()
    .waitFor();
  await page.getByRole("status", { name: "Loading popular TV shows" }).waitFor();
  const tvAfter = await tvHeading.boundingBox();
  assert.ok(Math.abs(tvAfter.y - tvBefore.y) <= 1, "A full movie shelf keeps the next section in place");
  releaseTv();
  await fitsViewport("Desktop home");
  await capture("home-desktop");
  await page
    .getByRole("button", { name: "Open A quiet adventure", exact: true })
    .first()
    .focus();
  await page.keyboard.press("Enter");
  await page.getByRole("status", { name: "Loading details" }).waitFor();
  await page.getByRole("button", { name: "Go back" }).waitFor();
  releaseDetails();
  await page.getByRole("heading", { name: movie.title, exact: true }).waitFor();
  await page.getByRole("heading", { name: "IMDb", exact: true }).waitFor();
  const openWith = page.getByRole("heading", { name: "Open with", exact: true });
  const openWithBefore = await openWith.boundingBox();
  const netflix = page.getByRole("heading", { name: "Netflix", exact: true });
  assert.equal(await netflix.count(), 0, "Ready links appear while provider data is pending");
  releaseProvider();
  await netflix.waitFor();
  const openWithAfter = await openWith.boundingBox();
  assert.ok(Math.abs(openWithAfter.y - openWithBefore.y) <= 1, "Late provider links keep the title layout in place");
  await fitsViewport("Desktop movie details");
  await capture("details-desktop");
  await page
    .getByRole("searchbox", { name: "Search connected services" })
    .fill("nothing");
  await page.getByRole("heading", { name: "No matching services" }).waitFor();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("heading", { name: "IMDb", exact: true }).waitFor();

  await page.goto(`${baseUrl}/home`);
  const search = page.getByRole("searchbox", {
    name: "Search movies and TV shows",
  });
  await search.fill("adventure");
  await page.getByRole("status", { name: "Searching titles" }).waitFor();
  await page.getByRole("button", { name: /A quiet adventure/ }).waitFor();
  await page.getByRole("button", { name: "TV", exact: true }).click();
  assert.equal(await page.locator(".search-result").count(), 1);
  await search.fill("offline");
  await page.getByRole("heading", { name: "Couldn’t search for titles" }).waitFor();
  await search.fill("nothing");
  await page
    .getByRole("heading", { name: "No titles found", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Clear search", exact: true })
    .last()
    .click();

  await page.goto(`${baseUrl}/details/tv/tmdb/200`);
  await page
    .getByRole("button", { name: "Open season 1: Season 1", exact: true })
    .click();
  const episodeCard = page.getByRole("button", {
    name: "Open season 1 episode 1: The beginning",
    exact: true,
  });
  await episodeCard.waitFor();
  holdSeason = true;
  await episodeCard.click();
  await page
    .getByRole("heading", { name: "S01E01 · The beginning", exact: true })
    .waitFor();
  await page.getByRole("status", { name: "Loading episodes" }).waitFor();
  releaseSeason();
  await episodeCard.waitFor();
  await capture("episode-desktop");

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [path, heading, label] of [
      ["/home", "Find your next favorite.", "home"],
      ["/details/movie/tmdb/100", movie.title, "details"],
      ["/settings", "Settings", "settings"],
      ["/?force=1", "Your services. One place.", "intro"],
    ]) {
      await page.goto(`${baseUrl}${path}`);
      await page.getByRole("heading", { name: heading, exact: true }).waitFor();
      await fitsViewport(`${width}px ${label}`);
      if (width === 390) await capture(`${label}-phone`);
    }
  }

  await page.goto(`${baseUrl}/settings`);
  await page.getByRole("button", { name: "Add instance", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Add an instance" });
  await picker.waitFor();
  await fitsViewport("Provider dialog");
  await capture("provider-dialog-phone");
  await page.keyboard.press("Escape");
  await picker.waitFor({ state: "hidden" });
  assert.equal(
    await page
      .getByRole("button", { name: "Add instance", exact: true })
      .evaluate((button) => button === document.activeElement),
    true,
    "Escape restores focus"
  );

  await page.getByRole("button", { name: "Add instance", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("listitem")
    .filter({ hasText: "Sonarr" })
    .click();
  const instanceDialog = page.getByRole("dialog", {
    name: "Add Sonarr Instance",
  });
  await instanceDialog.waitFor();
  await page
    .getByLabel("Instance Name", { exact: true })
    .fill("Second library");
  await page
    .getByLabel("Base URL", { exact: true })
    .fill("https://second.example.test");
  await page
    .getByLabel("API Key (Optional)", { exact: true })
    .fill("another-test-key");
  await capture("instance-dialog-phone");
  // Tab navigation stays in the active native dialog.
  await instanceDialog
    .getByRole("button", { name: "Add Instance", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  assert.equal(
    await instanceDialog.evaluate((dialog) =>
      dialog.contains(document.activeElement)
    ),
    true
  );
  await instanceDialog
    .getByRole("button", { name: "Add Instance", exact: true })
    .click();
  await instanceDialog.waitFor({ state: "hidden" });
  await page
    .getByRole("heading", { name: "Second library", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Edit Second library", exact: true })
    .click();
  await page
    .getByLabel("Instance Name", { exact: true })
    .fill("Renamed library");
  await page
    .getByRole("button", { name: "Update Instance", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete Renamed library", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Delete Instance", exact: true })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("heading", { name: "Renamed library", exact: true })
      .count(),
    0
  );
  await page
    .getByRole("button", { name: "Test connection", exact: true })
    .click();
  await page.getByText("Healthy", { exact: true }).waitFor();
  await page.setViewportSize({ width: 1024, height: 900 });
  await capture("settings-desktop");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}/home`);
  await page
    .getByRole("button", { name: "Open A quiet adventure", exact: true })
    .first()
    .waitFor();
  const fresh = await browser.newPage({ viewport: { width: 390, height: 844 } });
  fresh.setDefaultTimeout(60_000);
  await fresh.route("https://api.themoviedb.org/**", (route) => route.fulfill({ json: movie }));
  await fresh.goto(`${baseUrl}/movie?tmdbId=100`);
  await fresh.getByRole("checkbox", { name: "IMDb", exact: true }).waitFor();
  // Reload before finishing onboarding to exercise the saved destination.
  await fresh.reload();
  await fresh.getByRole("checkbox", { name: "IMDb", exact: true }).focus();
  await fresh.keyboard.press("Space");
  await fresh.getByRole("button", { name: "Continue", exact: true }).click();
  await fresh.waitForURL("**/details/movie/tmdb/100?source=tmdb");
  await fresh.getByRole("heading", { name: movie.title, exact: true }).waitFor();
  await fresh.close();

  assert.deepEqual(errors, []);
  const broken = await browser.newPage();
  await broken.route(/\/(src\/main\.ts|assets\/index-[^/]+\.js)(\?.*)?$/, (route) => route.abort());
  await broken.goto(`${baseUrl}/home`);
  await broken.getByRole("button", { name: "Reload MediaHub" }).waitFor();
  await broken.close();

  console.log(
    "Cross-app design: loading states, layout stability, search, keyboard cards, movie/TV navigation, first-use deep links, responsive layouts, modal focus, connection CRUD and health checks passed"
  );
} finally {
  await browser.close();
}
