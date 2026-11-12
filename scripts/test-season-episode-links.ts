import assert from "node:assert/strict";
import type { FormattedDetails } from "../src/models/models";
import { imdbTvId, imdbTvUrl, tmdbTvUrl, traktTvUrl } from "../src/data/services/providerUrls";
import { buildSeerrRequestPayload, hasSeerrRequest, useSeerr } from "../src/composables/useSeerr";

const show: FormattedDetails = {
  type: "tv",
  tmdbId: "1399",
  imdbId: "tt0944947",
  title: "Game of Thrones",
  releaseYear: "2011",
  traktSlug: "game-of-thrones-2011",
};
const seasonZero = { ...show, seasonNumber: 0 };
const episode = {
  ...show,
  seasonNumber: 1,
  episodeNumber: 2,
  episodeImdbId: "tt1480055",
};

assert.equal(tmdbTvUrl(show), "https://www.themoviedb.org/tv/1399");
assert.equal(tmdbTvUrl(seasonZero), "https://www.themoviedb.org/tv/1399/season/0");
assert.equal(tmdbTvUrl(episode), "https://www.themoviedb.org/tv/1399/season/1/episode/2");
assert.equal(tmdbTvUrl({ ...episode, episodeNumber: 0 }), "https://www.themoviedb.org/tv/1399/season/1");
assert.equal(imdbTvUrl(episode), "https://imdb.com/title/tt1480055");
assert.equal(imdbTvUrl(show), "https://imdb.com/title/tt0944947");
assert.equal(imdbTvId(episode), "tt1480055");
assert.equal(imdbTvId(show), "tt0944947");
assert.equal(traktTvUrl(show), "https://trakt.tv/shows/game-of-thrones-2011");
assert.equal(traktTvUrl(seasonZero), "https://trakt.tv/shows/game-of-thrones-2011/seasons/0");
assert.equal(traktTvUrl(episode), "https://trakt.tv/shows/game-of-thrones-2011/seasons/1/episodes/2");

const movie: FormattedDetails = { type: "movie", tmdbId: "238", title: "The Godfather" };
assert.equal(buildSeerrRequestPayload(movie).mediaType, "movie");
assert.deepEqual(buildSeerrRequestPayload(show), {
  mediaType: "tv", mediaId: 1399, seasons: "all",
});
assert.deepEqual(buildSeerrRequestPayload(seasonZero), {
  mediaType: "tv", mediaId: 1399, seasons: [0],
});
assert.deepEqual(buildSeerrRequestPayload(episode), {
  mediaType: "tv", mediaId: 1399, seasons: [1],
});

const requests = [
  { status: 1, type: "tv" as const, seasons: [{ seasonNumber: 1, status: 1 }] },
];
assert.equal(hasSeerrRequest(requests, episode)?.status, 1);
assert.equal(hasSeerrRequest(requests, seasonZero), undefined);
assert.equal(hasSeerrRequest(requests, show)?.status, 1);

const previousFetch = globalThis.fetch;
globalThis.fetch = async () => new Response(JSON.stringify({ mediaInfo: {
  status: 5,
  seasons: [{ seasonNumber: 1, status: 1 }],
  requests,
} }), { status: 200 });
try {
  const seerr = useSeerr();
  const instance = { id: "seerr", name: "Seerr", baseUrl: "https://seerr.example", apiKey: "secret" };
  await seerr.fetchStatus("season-1", instance, episode);
  assert.equal(seerr.getStatus("season-1"), "pending");
  await seerr.fetchStatus("season-0", instance, seasonZero);
  assert.equal(seerr.getStatus("season-0"), "unknown");
  await seerr.fetchStatus("show", instance, show);
  assert.equal(seerr.getStatus("show"), "available");

  const pendingStatuses: ((response: Response) => void)[] = [];
  globalThis.fetch = async () => new Promise<Response>((resolve) => pendingStatuses.push(resolve));
  const staleFetch = seerr.fetchStatus("seerr", instance, episode);
  assert.equal(pendingStatuses.length, 1);
  seerr.reset();
  const currentFetch = seerr.fetchStatus("seerr", instance, show);
  assert.equal(pendingStatuses.length, 2);
  pendingStatuses[1](new Response(JSON.stringify({ mediaInfo: { status: 5 } }), { status: 200 }));
  await currentFetch;
  assert.equal(seerr.getStatus("seerr"), "available");
  pendingStatuses[0](new Response(JSON.stringify({ mediaInfo: {
    requests: [{ status: 1, type: "tv", seasons: [{ seasonNumber: 1, status: 1 }] }],
  } }), { status: 200 }));
  await staleFetch;
  assert.equal(seerr.getStatus("seerr"), "available");
} finally {
  globalThis.fetch = previousFetch;
}

console.log("Season and episode link checks passed");
