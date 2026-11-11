import assert from 'node:assert/strict';
import { getTvShowIdFromFindResponse } from '../src/utils/tmdbFind';

assert.equal(getTvShowIdFromFindResponse({ tv_results: [{ id: 101 }] }), 101);
assert.equal(getTvShowIdFromFindResponse({
  tv_results: [{ id: 104 }],
  tv_episode_results: [{ id: 204, show_id: 105 }],
}), 104);
assert.equal(getTvShowIdFromFindResponse({
  tv_episode_results: [{ id: 201, show_id: 102 }],
}), 102);
assert.equal(getTvShowIdFromFindResponse({
  tv_season_results: [{ id: 301, show_id: 103 }],
}), 103);
assert.equal(getTvShowIdFromFindResponse({
  tv_episode_results: [{ id: 202 }],
}), undefined);
assert.equal(getTvShowIdFromFindResponse({
  tv_episode_results: [{ id: 203, show_id: '106' }],
}), 106);

console.log('TMDB IMDb find result checks passed');
