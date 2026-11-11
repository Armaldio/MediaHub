import assert from "node:assert/strict";
import { extractWikidataProviderIds } from "../src/utils/wikidataProviderIds";
import { buildSeerrRequestPayload, hasSeerrRequest } from "../src/composables/useSeerr";
import { allocineUrl, filmwebUrl, hasAllocineMovieId, metacriticUrl } from "../src/utils/knownProviderLinks";

const claim = (value: string | number) => [{ mainsnak: { datavalue: { value } } }];
const providerIds = extractWikidataProviderIds({
  P1258: claim("m/the-godfather"),
  P1712: claim("movie/the-godfather"),
  P6466: claim("hulu-movie-id"),
  P6467: claim("hulu-series-id"),
  P11330: claim("crunchyroll-series-id"),
  P6398: claim(1234),
  P1237: claim("12345"),
  P5032: claim("681141"),
  P1265: claim("28359"),
}, "movie");
assert.equal(providerIds.rottenTomatoesId, "m/the-godfather");
assert.equal(providerIds.metacriticId, "movie/the-godfather");
assert.equal(providerIds.huluMovieId, "hulu-movie-id");
assert.equal(providerIds.huluSeriesId, undefined);
assert.equal(providerIds.crunchyrollId, undefined);
assert.equal(providerIds.itunesId, "1234");
assert.equal(providerIds.boxOfficeMojoId, "12345");
assert.equal(extractWikidataProviderIds({ P6398: claim(42) }, "tv").itunesId, undefined);

const formattedDetails = {
  type: "movie", tmdbId: "238", title: "The Godfather", ...providerIds,
} as const;
assert.equal(metacriticUrl(formattedDetails as never), "https://www.metacritic.com/movie/the-godfather");
assert.equal(filmwebUrl(formattedDetails as never), "https://www.filmweb.pl/film?Id=681141");
assert.equal(hasAllocineMovieId(formattedDetails as never), true);
assert.equal(allocineUrl(formattedDetails as never), "https://www.allocine.fr/film/fichefilm_gen_cfilm=28359.html");
assert.equal(hasAllocineMovieId({ ...formattedDetails, type: "tv" } as never), false);

const movie = { type: "movie", tmdbId: "123", title: "Movie" } as const;
const show = { type: "tv", tmdbId: "456", tvdbId: "789", title: "Show" } as const;
assert.deepEqual(buildSeerrRequestPayload(movie as never), { mediaType: "movie", mediaId: 123 });
assert.deepEqual(buildSeerrRequestPayload(show as never), {
  mediaType: "tv", mediaId: 456, tvdbId: 789, seasons: "all",
});
const requests = [
  { status: 1, type: "tv" as const },
  { status: 1, type: "movie" as const },
];
assert.equal(hasSeerrRequest(requests, show as never)?.type, "tv");
assert.equal(hasSeerrRequest(requests, movie as never)?.type, "movie");

const previousFetch = globalThis.fetch;
const calls: string[] = [];
let mockedMediaInfo = { status: 5, requests: [] as { status: number; type: "movie" | "tv" }[] };
globalThis.fetch = async (input) => {
  calls.push(String(input));
  return new Response(JSON.stringify({ mediaInfo: mockedMediaInfo }), { status: 200 });
};
try {
  const { useSeerr } = await import("../src/composables/useSeerr");
  const integration = useSeerr();
  const instance = { id: "one", name: "Primary", baseUrl: "https://seerr.example/", apiKey: "secret" };
  await integration.fetchStatus("seerr-one", instance, movie as never);
  assert.equal(integration.getStatus("seerr-one"), "available");
  assert.deepEqual(calls, ["https://seerr.example/api/v1/movie/123"]);
  await integration.fetchStatus("seerr-two", { ...instance, id: "two" }, show as never);
  assert.equal(integration.getStatus("seerr-two"), "available");
  assert.deepEqual(calls, ["https://seerr.example/api/v1/movie/123", "https://seerr.example/api/v1/tv/456"]);
  mockedMediaInfo = { status: 2, requests: [{ status: 2, type: "movie" }] };
  await integration.fetchStatus("seerr-three", { ...instance, id: "three" }, movie as never);
  assert.equal(integration.getStatus("seerr-three"), "pending");
  mockedMediaInfo = { status: 2, requests: [{ status: 3, type: "movie" }] };
  await integration.fetchStatus("seerr-four", { ...instance, id: "four" }, movie as never);
  assert.equal(integration.getStatus("seerr-four"), "declined");
} finally {
  globalThis.fetch = previousFetch;
}
