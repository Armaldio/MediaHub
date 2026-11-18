import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const launchOptions = { headless: true };
if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) {
  launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
}

const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
let browser;

try {
  browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript(() => localStorage.setItem('servicesState', JSON.stringify({
    selectedServiceIds: ['the_movie_database', 'imdb', 'trakt', 'tvdb'],
    customInstances: {},
  })));

  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  const show = {
    id: 100,
    name: 'Browser Test Show',
    overview: 'Parent show overview',
    first_air_date: '2020-02-03',
    vote_average: 7,
    genres: [{ id: 1, name: 'Drama' }],
    poster_path: null,
    backdrop_path: null,
    episode_run_time: [40],
    number_of_seasons: 1,
    number_of_episodes: 2,
    seasons: [
      { id: 700, name: 'Specials', season_number: 0, episode_count: 1 },
      { id: 701, name: 'Season 1', season_number: 1, episode_count: 1 },
    ],
    external_ids: { imdb_id: 'tt100', tvdb_id: null, wikidata_id: null },
  };

  await page.route('https://api.themoviedb.org/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    const episodeMatch = pathname.match(/^\/3\/tv\/100\/season\/(\d+)\/episode\/(\d+)$/);
    const seasonMatch = pathname.match(/^\/3\/tv\/100\/season\/(\d+)$/);

    if (pathname === '/3/tv/100') {
      await route.fulfill({ json: show });
    } else if (episodeMatch) {
      const [, seasonNumber, episodeNumber] = episodeMatch;
      await route.fulfill({ json: {
        id: 900,
        name: `Episode ${episodeNumber} story`,
        season_number: Number(seasonNumber),
        episode_number: Number(episodeNumber),
        show_id: 100,
        overview: '',
        air_date: null,
        runtime: 42,
        vote_average: 0,
        still_path: null,
        external_ids: {},
      } });
    } else if (seasonMatch) {
      const seasonNumber = Number(seasonMatch[1]);
      await route.fulfill({ json: {
        id: 700 + seasonNumber,
        name: seasonNumber === 0 ? 'Specials' : `Season ${seasonNumber}`,
        season_number: seasonNumber,
        air_date: null,
        overview: '',
        poster_path: null,
        vote_average: 0,
        episodes: [],
        external_ids: {},
      } });
    } else {
      await route.fulfill({ status: 404, json: { status_message: 'Not found' } });
    }
  });

  for (const [path, title] of [
    ['/details/tv/tmdb/100?season=1&episode=1', 'S01E01 · Episode 1 story'],
    ['/details/tv/tmdb/100?season=0', 'Specials'],
  ]) {
    await page.goto(`${baseUrl}${path}`);
    await page.getByRole('heading', { name: title, exact: true }).waitFor();
    const body = await page.locator('body').innerText();
    assert.ok(!body.includes('Parent show overview'), 'empty scoped overview cannot fall back to parent');
    assert.ok(!body.includes('2020'), 'missing scoped date cannot fall back to parent year');
    assert.ok(!body.includes('7.0'), 'unrated scope cannot fall back to parent rating');
    assert.ok(body.includes('No description available.'), 'empty scoped overview shows unavailable copy');
    console.log(`PASS empty scoped metadata: ${title}`);
  }

  await page.goto(`${baseUrl}/details/tv/tmdb/100`);
  await page.getByRole('heading', { name: 'Browser Test Show', exact: true }).waitFor();
  const showBody = await page.locator('body').innerText();
  assert.ok(showBody.includes('Parent show overview'));
  assert.ok(showBody.includes('2020'));
  assert.ok(showBody.includes('7.0'));
  assert.deepEqual(errors, []);
  console.log('PASS parent show metadata remains visible; no page errors');

  // Enrichment must work when TMDB supplies external IDs without Wikidata.
  show.external_ids.tvdb_id = 321;
  show.external_ids.trakt = 789;
  const enrichmentRequests = [];
  const consoleMessages = [];
  page.on('console', message => consoleMessages.push(message.text()));
  await page.route('https://api4.thetvdb.com/**', async route => {
    const { pathname } = new URL(route.request().url());
    enrichmentRequests.push(pathname);
    const data = pathname.endsWith('/login')
      ? { token: 'regression-test-bearer-token' }
      : pathname.endsWith('/artwork') ? [] : { slug: 'browser-test-show' };
    await route.fulfill({ json: { data } });
  });
  await page.route('https://api.trakt.tv/**', async route => {
    enrichmentRequests.push(new URL(route.request().url()).pathname);
    await route.fulfill({ json: { ids: { slug: 'browser-test-show-2020' } } });
  });
  const artworkResponse = page.waitForResponse('https://api4.thetvdb.com/v4/series/321/artwork');
  const traktResponse = page.waitForResponse('https://api.trakt.tv/shows/789?extended=false');
  await page.reload();
  await Promise.all([artworkResponse, traktResponse]);
  await page.getByRole('heading', { name: 'TheTVDB', exact: true }).waitFor();
  assert.ok(enrichmentRequests.includes('/shows/789'), 'Trakt lookup runs without Wikidata');
  assert.ok(!consoleMessages.some(message => message.includes('regression-test-bearer-token')));
  assert.deepEqual(errors, []);
  console.log('PASS TVDB and Trakt enrichment without Wikidata; bearer token stays out of logs');
} finally {
  await browser?.close();
}
