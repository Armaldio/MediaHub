import { TMDB, type AvailableLanguage } from 'tmdb-ts';

export interface TvScopeSelection {
  seasonNumber?: number;
  episodeNumber?: number;
}

export function fetchTvSeason(tmdb: TMDB, showId: number, seasonNumber: number, language: AvailableLanguage) {
  return tmdb.tvSeasons.details(
    { tvShowID: showId, seasonNumber },
    ['external_ids'],
    { language }
  );
}

export async function fetchTvDetailsForScope(
  tmdb: TMDB,
  showId: number,
  scope: TvScopeSelection,
  language: AvailableLanguage
) {
  const showRequest = tmdb.tvShows.details(showId, ['external_ids'], language);
  if (scope.seasonNumber === undefined) {
    return { show: await showRequest, season: null, scope: null };
  }

  if (scope.episodeNumber === undefined) {
    const [show, season] = await Promise.all([
      showRequest,
      fetchTvSeason(tmdb, showId, scope.seasonNumber, language)
    ]);
    return { show, season, scope: season };
  }

  const [show, episode] = await Promise.all([
    showRequest,
    tmdb.tvEpisode.details(
      { tvShowID: showId, seasonNumber: scope.seasonNumber, episodeNumber: scope.episodeNumber },
      ['external_ids'],
      { language }
    )
  ]);
  return { show, season: null, scope: episode };
}
