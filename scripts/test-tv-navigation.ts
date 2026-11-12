import assert from 'node:assert/strict';
import type { TMDB } from 'tmdb-ts';
import { parseDeepLink, navigateFromDeepLink } from '../src/utils/deepLink';
import { resolveTvFindResult } from '../src/utils/tmdbFind';
import { fetchTvDetailsForScope } from '../src/utils/tvDetails';

const specialEpisodeLink = parseDeepLink('mediahub://show?tmdbId=100&season=0&episode=1');
assert.deepEqual(specialEpisodeLink, {
  type: 'show', tmdbId: '100', imdbId: undefined, season: '0', episode: '1',
});

const originalConsoleError = console.error;
console.error = () => {};
const invalidEpisodeLink = parseDeepLink('mediahub://show?tmdbId=100&episode=1');
assert.equal(invalidEpisodeLink, null);
assert.equal(parseDeepLink('mediahub://show?tmdbId=100&season=-1'), null);
console.error = originalConsoleError;

const pushed: Array<{ name: string; params: Record<string, string>; query: Record<string, string> }> = [];
navigateFromDeepLink({ push: (route: (typeof pushed)[number]) => pushed.push(route) }, specialEpisodeLink!);
assert.deepEqual(pushed[0], {
  name: 'details-tmdb',
  params: { mediaType: 'tv', tmdbId: '100' },
  query: { source: 'tmdb', season: '0', episode: '1' },
});

assert.deepEqual(resolveTvFindResult({
  tv_episode_results: [{ id: 200, show_id: 100, season_number: 0, episode_number: 1 }],
}), { showId: 100, seasonNumber: 0, episodeNumber: 1 });

const calls: string[] = [];
const mockedTmdb = {
  tvShows: { details: async (id: number) => { calls.push(`show:${id}`); return { id, name: 'Mock Show' }; } },
  tvSeasons: { details: async ({ tvShowID, seasonNumber }: { tvShowID: number; seasonNumber: number }) => {
    calls.push(`season:${tvShowID}:${seasonNumber}`);
    return { id: 300, season_number: seasonNumber, name: 'Specials', episodes: [] };
  } },
  tvEpisode: { details: async ({ tvShowID, seasonNumber, episodeNumber }: { tvShowID: number; seasonNumber: number; episodeNumber: number }) => {
    calls.push(`episode:${tvShowID}:${seasonNumber}:${episodeNumber}`);
    return { id: 400, name: 'Pilot', season_number: seasonNumber, episode_number: episodeNumber };
  } },
} as unknown as TMDB;

const loaded = await fetchTvDetailsForScope(mockedTmdb, 100, { seasonNumber: 0, episodeNumber: 1 }, 'en-US');
assert.deepEqual(calls, ['show:100', 'season:100:0', 'episode:100:0:1']);
assert.equal(loaded.show.id, 100);
assert.equal(loaded.season?.id, 300);
assert.equal(loaded.scope?.id, 400);

console.log('TV deep-link routing and mocked details checks passed');
