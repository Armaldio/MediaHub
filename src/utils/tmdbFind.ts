interface TmdbFindResult {
  id: number;
  show_id?: number | string;
  season_number?: number;
  episode_number?: number;
}

interface TmdbFindResponse {
  tv_results?: TmdbFindResult[];
  tv_episode_results?: TmdbFindResult[];
  tv_season_results?: TmdbFindResult[];
}

export function getTvShowIdFromFindResponse(response: TmdbFindResponse): number | undefined {
  return resolveTvFindResult(response)?.showId;
}

export interface TvFindResolution {
  showId: number;
  seasonNumber?: number;
  episodeNumber?: number;
}

export function resolveTvFindResult(response: TmdbFindResponse): TvFindResolution | undefined {
  const tvShowId = response.tv_results?.[0]?.id;
  if (tvShowId !== undefined) return { showId: tvShowId };

  const episode = response.tv_episode_results?.[0];
  const season = response.tv_season_results?.[0];
  const parentShowId = episode?.show_id ?? season?.show_id;
  if (parentShowId === undefined) return undefined;

  const parsedShowId = Number(parentShowId);
  if (!Number.isInteger(parsedShowId) || parsedShowId <= 0) return undefined;

  return episode
    ? { showId: parsedShowId, seasonNumber: episode.season_number, episodeNumber: episode.episode_number }
    : { showId: parsedShowId, seasonNumber: season?.season_number };
}
