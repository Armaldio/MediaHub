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
import { resolveTvFindResult } from '@/utils/tmdbFind';
import { fetchTvDetailsForScope, type TvScopeSelection } from '@/utils/tvDetails';

type TvScopeDetails =
  | AppendToResponse<SeasonDetails, 'external_ids'[], 'tvSeason'>
  | AppendToResponse<Omit<Episode, 'show_id'>, 'external_ids'[], 'tvEpisode'>;

// Default language fallback
const DEFAULT_LANGUAGE = 'en-US';

export const useMoviesStore = defineStore('movies', () => {
  // Get user's preferred language from browser or use default
  const userLanguage = ref<AvailableLanguage>(
    localStorage.getItem('userLanguage') as AvailableLanguage || 
    navigator.language as AvailableLanguage || 
    DEFAULT_LANGUAGE
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
  const loading = ref(false)
  const error = ref<string | null>(null)
  let detailsRequestId = 0

  // Initialize TMDB client
  const tmdb = new TMDB(import.meta.env.VITE_TMDB_API_KEY);

  const fetchPopularMovies = async () => {
    try {
      loading.value = true;
      const response = await tmdb.movies.popular({
        language: userLanguage.value
      });

      popularMovies.value = response.results
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch popular movies'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchPopularTVShows = async () => {
    try {
      loading.value = true;
      const response = await tmdb.tvShows.popular({
        language: userLanguage.value
      });

      popularTVShows.value = response.results
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch popular TV shows'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const searchMulti = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    try {
      loading.value = true;
      const response = await tmdb.search.multi({ 
        query, 
        page: 1,
        language: userLanguage.value,
        include_adult: false
      });
      searchResults.value = response.results
    } catch (err) {
      error.value = 'Search failed'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchDetails = async (id: number, mediaType: MediaType) => {
    const requestId = ++detailsRequestId
    try {
      loading.value = true;
      error.value = null;

      let detailsResponse: AppendToResponse<TvShowDetails, "external_ids"[], "tvShow"> | AppendToResponse<MovieDetails, "external_ids"[], "movie"> | null = null;

      if (mediaType === 'movie') {
        const response = await tmdb.movies.details(id, ['external_ids'], userLanguage.value);
        detailsResponse = response;
      } else if (mediaType === 'tv') {
        const response = await tmdb.tvShows.details(id, ['external_ids'], userLanguage.value);
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
      if (requestId === detailsRequestId) loading.value = false
    }
  }

  const cancelPendingDetails = () => {
    detailsRequestId += 1
    loading.value = false
    error.value = null
  }

  const fetchTvDetails = async (
    showId: number,
    scope: TvScopeSelection = {},
    requestId = ++detailsRequestId
  ) => {
    try {
      loading.value = true
      error.value = null
      currentDetails.value = null
      currentTvScope.value = null
      currentTvSeason.value = null

      if (scope.episodeNumber !== undefined && scope.seasonNumber === undefined) {
        throw new Error('An episode requires a season number')
      }
      const { show, season, scope: scopedDetails } = await fetchTvDetailsForScope(
        tmdb, showId, scope, userLanguage.value
      )

      if (requestId === detailsRequestId) {
        currentDetails.value = show
        currentTvScope.value = scopedDetails
        currentTvSeason.value = season
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
      if (requestId === detailsRequestId) loading.value = false
    }
  }

  const fetchDetailsByImdbId = async (
    imdbId: string,
    mediaType: MediaType,
    requestedScope: TvScopeSelection = {}
  ) => {
    const requestId = ++detailsRequestId
    try {
      loading.value = true
      error.value = null
      currentDetails.value = null
      currentTvScope.value = null
      currentTvSeason.value = null
      
      if (!imdbId) {
        throw new Error('No IMDB ID provided');
      }
      
      // First, search by IMDB ID to get the TMDB ID
      const searchResponse = await tmdb.find.byExternalId(imdbId, { external_source: 'imdb_id' });
      
      if (!searchResponse) {
        throw new Error('No response from TMDB API');
      }
      if (requestId !== detailsRequestId) return;

      console.log('searchResponse', JSON.stringify(searchResponse))
      
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
      if (requestId === detailsRequestId) loading.value = false
    }
  }

  const getImageUrl = (path: string, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
  }


  const clearSearch = () => {
    searchResults.value = []
  }

  const fetchTrending = async (mediaType: TrendingMediaType, timeWindow: 'day' | 'week' = 'week') => {
    try {
      loading.value = true;
      const response = await tmdb.trending.trending(mediaType, timeWindow, { language: userLanguage.value });
      trending.value = response.results as TrendingResults<'all'>['results']
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch trending content'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    popularMovies,
    popularTVShows,
    trending,
    searchResults,
    currentDetails,
    currentTvScope,
    currentTvSeason,
    loading,
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
