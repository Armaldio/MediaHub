import { TMDB, type AvailableLanguage } from 'tmdb-ts';

export interface TvScopeSelection {
  seasonNumber?: number;
  episodeNumber?: number;
}

export async function fetchTvDetailsForScope(
  tmdb: TMDB,
  showId: number,
  scope: TvScopeSelection,
  language: AvailableLanguage
) {
  const show = await tmdb.tvShows.details(showId, ['external_ids'], language);
  if (scope.seasonNumber === undefined) return { show, season: null, scope: null };

  const season = await tmdb.tvSeasons.details(
    { tvShowID: showId, seasonNumber: scope.seasonNumber },
    ['external_ids'],
    { language }
  );
  if (scope.episodeNumber === undefined) return { show, season, scope: season };

  const episode = await tmdb.tvEpisode.details(
    { tvShowID: showId, seasonNumber: scope.seasonNumber, episodeNumber: scope.episodeNumber },
    ['external_ids'],
    { language }
  );
  return { show, season, scope: episode };
}
