import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  AppendToResponse,
  MultiSearchResult,
  TMDB,
  MovieDetails,
  TvShowDetails,
  TrendingResults,
  Movie,
  PopularTvShowResult,
  MediaType,
  AvailableLanguage,
  TrendingMediaType,
  SeasonDetails,
  Episode
} from 'tmdb-ts';
import { withRequestTimeout } from '@/utils/requestTimeout';
import { resolveTvFindResult } from '@/utils/tmdbFind';
import { fetchTvDetailsForScope, fetchTvSeason, type TvScopeSelection } from '@/utils/tvDetails';

type TvScopeDetails =
  | AppendToResponse<SeasonDetails, 'external_ids'[], 'tvSeason'>
  | AppendToResponse<Omit<Episode, 'show_id'>, 'external_ids'[], 'tvEpisode'>;

// Default language fallback
const DEFAULT_LANGUAGE = 'en-US';

export const useMoviesStore = defineStore('movies', () => {
  // Get user's preferred language from browser or use default
  let savedLanguage: AvailableLanguage | null = null;
  try {
    savedLanguage = localStorage.getItem('userLanguage') as AvailableLanguage | null;
  } catch {
    // Use the browser language when storage is unavailable.
  }
  const userLanguage = ref<AvailableLanguage>(
    savedLanguage || navigator.language as AvailableLanguage || DEFAULT_LANGUAGE
  );

  // Update language preference
  const setLanguage = (lang: AvailableLanguage) => {
    userLanguage.value = lang;
    localStorage.setItem('userLanguage', lang);
  };

  const currentLanguage = computed(() => userLanguage.value);
  const popularMovies = ref<Movie[]>([])
  const popularTVShows = ref<PopularTvShowResult[]>([])
  const trending = ref<TrendingResults<'all'>['results']>([])
  const searchResults = ref<MultiSearchResult[]>([])
  const currentDetails = ref<AppendToResponse<TvShowDetails, "external_ids"[], "tvShow">
  | AppendToResponse<MovieDetails, "external_ids"[], "movie"> | null>(null)
  const currentTvScope = ref<TvScopeDetails | null>(null)
  const currentTvSeason = ref<AppendToResponse<SeasonDetails, 'external_ids'[], 'tvSeason'> | null>(null)
  const searchLoading = ref(false)
  const detailsLoading = ref(false)
  const tvSeasonLoading = ref(false)
  const tvSeasonError = ref(false)
  const searchError = ref<string | null>(null)
  const error = ref<string | null>(null)
  let detailsRequestId = 0
  let searchRequestId = 0

  // Initialize TMDB client
  const tmdb = new TMDB(import.meta.env.VITE_TMDB_API_KEY);

  const fetchPopularMovies = async () => {
    try {
      const response = await withRequestTimeout(tmdb.movies.popular({
        language: userLanguage.value
      }));

      popularMovies.value = response.results
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch popular movies'
      console.error(err)
      return []
    }
  }

  const fetchPopularTVShows = async () => {
    try {
      const response = await withRequestTimeout(tmdb.tvShows.popular({
        language: userLanguage.value
      }));

      popularTVShows.value = response.results
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch popular TV shows'
      console.error(err)
      return []
    }
  }

  const clearSearch = () => {
    searchRequestId += 1
    searchResults.value = []
    searchLoading.value = false
    searchError.value = null
  }

  const searchMulti = async (query: string) => {
    if (!query.trim()) {
      clearSearch()
      return
    }

    const requestId = ++searchRequestId
    searchLoading.value = true
    searchError.value = null
    try {
      const response = await withRequestTimeout(tmdb.search.multi({
        query,
        page: 1,
        language: userLanguage.value,
        include_adult: false
      }))
      if (requestId === searchRequestId) {
        searchResults.value = response.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      }
    } catch (err) {
      if (requestId === searchRequestId) searchError.value = 'Search failed'
      console.error(err)
    } finally {
      if (requestId === searchRequestId) searchLoading.value = false
    }
  }

  const fetchDetails = async (id: number, mediaType: MediaType) => {
    const requestId = ++detailsRequestId
    try {
      detailsLoading.value = true;
      error.value = null;

      let detailsResponse: AppendToResponse<TvShowDetails, "external_ids"[], "tvShow"> | AppendToResponse<MovieDetails, "external_ids"[], "movie"> | null = null;

      if (mediaType === 'movie') {
        const response = await withRequestTimeout(tmdb.movies.details(id, ['external_ids'], userLanguage.value));
        detailsResponse = response;
      } else if (mediaType === 'tv') {
        const response = await withRequestTimeout(tmdb.tvShows.details(id, ['external_ids'], userLanguage.value));
        detailsResponse = response;
      // } else if (mediaType === 'tvEpisode') {
      //   detailsResponse = await tmdb.tvEpisode.details({
      //     tvShowID: id,
      //     seasonNumber: 1,
      //     episodeNumber: 1
      //   }, ['external_ids']);
      } else {
        throw new Error('Invalid media type');
      }

      if (!detailsResponse) {
        throw new Error('No data returned from API');
      }

      if (requestId !== detailsRequestId) return detailsResponse
      currentTvScope.value = null
      currentTvSeason.value = null
      currentDetails.value = detailsResponse

      return detailsResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch details';
      if (requestId === detailsRequestId) {
        error.value = `Error loading ${mediaType === 'movie' ? 'movie' : 'TV show'} details: ${errorMessage}`
      }
      console.error('Error in fetchDetails:', err)
      throw new Error(requestId === detailsRequestId ? error.value! : errorMessage);
    } finally {
      if (requestId === detailsRequestId) detailsLoading.value = false
    }
  }

  const cancelPendingDetails = () => {
    detailsRequestId += 1
    detailsLoading.value = false
    tvSeasonLoading.value = false
    tvSeasonError.value = false
    error.value = null
  }

  const loadEpisodeSeason = async (showId: number, seasonNumber: number, requestId = detailsRequestId) => {
    tvSeasonLoading.value = true
    tvSeasonError.value = false
    try {
      const season = await withRequestTimeout(fetchTvSeason(tmdb, showId, seasonNumber, userLanguage.value))
      if (requestId === detailsRequestId) currentTvSeason.value = season
    } catch (error) {
      if (requestId === detailsRequestId) tvSeasonError.value = true
      console.error('Could not load the episode list:', error)
    } finally {
      if (requestId === detailsRequestId) tvSeasonLoading.value = false
    }
  }

  const fetchTvDetails = async (
    showId: number,
    scope: TvScopeSelection = {},
    requestId = ++detailsRequestId
  ) => {
    try {
      detailsLoading.value = true
      error.value = null
      currentDetails.value = null
      currentTvScope.value = null
      currentTvSeason.value = null

      if (scope.episodeNumber !== undefined && scope.seasonNumber === undefined) {
        throw new Error('An episode requires a season number')
      }
      const mainDetails = fetchTvDetailsForScope(tmdb, showId, scope, userLanguage.value)
      if (scope.episodeNumber !== undefined && scope.seasonNumber !== undefined) {
        void loadEpisodeSeason(showId, scope.seasonNumber, requestId)
      }
      const { show, season, scope: scopedDetails } = await withRequestTimeout(mainDetails)

      if (requestId === detailsRequestId) {
        currentDetails.value = show
        currentTvScope.value = scopedDetails
        if (scope.episodeNumber === undefined) currentTvSeason.value = season
      }
      return { show, scope: scopedDetails }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch TV details'
      if (requestId === detailsRequestId) {
        currentDetails.value = null
        currentTvScope.value = null
        currentTvSeason.value = null
        error.value = `Error loading TV details: ${errorMessage}`
      }
      throw new Error(error.value ?? `Error loading TV details: ${errorMessage}`)
    } finally {
      if (requestId === detailsRequestId) detailsLoading.value = false
    }
  }

  const fetchDetailsByImdbId = async (
    imdbId: string,
    mediaType: MediaType,
    requestedScope: TvScopeSelection = {}
  ) => {
    const requestId = ++detailsRequestId
    try {
      detailsLoading.value = true
      error.value = null
      currentDetails.value = null
      currentTvScope.value = null
      currentTvSeason.value = null
      
      if (!imdbId) {
        throw new Error('No IMDB ID provided');
      }
      
      // First, search by IMDB ID to get the TMDB ID
      const searchResponse = await withRequestTimeout(tmdb.find.byExternalId(imdbId, { external_source: 'imdb_id' }));
      
      if (!searchResponse) {
        throw new Error('No response from TMDB API');
      }
      if (requestId !== detailsRequestId) return;

      // Determine which type of media to get details for
      if (mediaType === 'movie') {
        const movieResults = searchResponse.movie_results?.[0];
        if (!movieResults) throw new Error('No movie found with this IMDB ID');
        return await fetchDetails(movieResults.id, 'movie');
      } else if (mediaType === 'tv') {
        const resolved = resolveTvFindResult(searchResponse);
        if (!resolved) throw new Error('No TV show found with this IMDB ID');
        return await fetchTvDetails(resolved.showId, {
          seasonNumber: requestedScope.seasonNumber ?? resolved.seasonNumber,
          episodeNumber: requestedScope.episodeNumber ?? resolved.episodeNumber,
        }, requestId);
      } else {
        throw new Error('Invalid media type');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch details by IMDB ID';
      if (requestId === detailsRequestId) error.value = `Error loading details: ${errorMessage}`
      console.error('Error in fetchDetailsByImdbId:', err)
      throw new Error(requestId === detailsRequestId ? error.value! : errorMessage);
    } finally {
      if (requestId === detailsRequestId) detailsLoading.value = false
    }
  }

  const getImageUrl = (path: string, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
  }


  const fetchTrending = async (mediaType: TrendingMediaType, timeWindow: 'day' | 'week' = 'week') => {
    try {
      const response = await withRequestTimeout(tmdb.trending.trending(mediaType, timeWindow, { language: userLanguage.value }));
      trending.value = response.results as TrendingResults<'all'>['results']
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch trending content'
      console.error(err)
      return []
    }
  }

  return {
    searchError,
    searchLoading,
    detailsLoading,
    tvSeasonLoading,
    tvSeasonError,
    loadEpisodeSeason,
    popularMovies,
    popularTVShows,
    trending,
    searchResults,
    currentDetails,
    currentTvScope,
    currentTvSeason,
    error,
    currentLanguage,
    setLanguage,
    fetchPopularMovies,
    fetchPopularTVShows,
    searchMulti,
    fetchDetails,
    cancelPendingDetails,
    fetchTvDetails,
    fetchDetailsByImdbId,
    getImageUrl,
    clearSearch,
    fetchTrending
  }
})
