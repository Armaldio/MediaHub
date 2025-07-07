import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppendToResponse, MultiSearchResult, TMDB, MovieDetails, TvShowDetails, TrendingResults, Movie, PopularTvShowResult, MediaType, Episode } from 'tmdb-ts';

export const useMoviesStore = defineStore('movies', () => {
  const popularMovies = ref<Movie[]>([])
  const popularTVShows = ref<PopularTvShowResult[]>([])
  const trending = ref<TrendingResults<any>[]>([])
  const searchResults = ref<MultiSearchResult[]>([])
  const currentDetails = ref<AppendToResponse<TvShowDetails, "external_ids"[], "tvShow">
  | AppendToResponse<MovieDetails, "external_ids"[], "movie"> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  
  const tmdb = new TMDB(import.meta.env.VITE_TMDB_API_KEY);

  const fetchPopularMovies = async (page = 1) => {
    try {
      loading.value = true
      const response = await tmdb.movies.popular({ page });
      
      if (page === 1) {
        popularMovies.value = response.results
      } else {
        popularMovies.value = [...popularMovies.value, ...response.results]
      }
      
      currentPage.value = response.page
      totalPages.value = response.total_pages
      return response.results
    } catch (err) {
      error.value = 'Failed to fetch popular movies'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchPopularTVShows = async (page = 1) => {
    try {
      loading.value = true
      const response = await tmdb.tvShows.popular({ page });
      
      if (page === 1) {
        popularTVShows.value = response.results
      } else {
        popularTVShows.value = [...popularTVShows.value, ...response.results]
      }
      
      currentPage.value = response.page
      totalPages.value = response.total_pages
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
      loading.value = true
      const response = await tmdb.search.multi({ query });
      searchResults.value = response.results
    } catch (err) {
      error.value = 'Search failed'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchDetails = async (id: number, mediaType: MediaType) => {
    try {
      loading.value = true
      error.value = null
      let detailsResponse: 
      | AppendToResponse<TvShowDetails, "external_ids"[], "tvShow">
      | AppendToResponse<MovieDetails, "external_ids"[], "movie">
      | AppendToResponse<Episode, "external_ids"[], "tvEpisode">;
      
      if (mediaType === 'movie') {
        detailsResponse = await tmdb.movies.details(id, ['external_ids']);
      } else if (mediaType === 'tv') {
        detailsResponse = await tmdb.tvShows.details(id, ['external_ids']);
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
      
      currentDetails.value = detailsResponse
      return detailsResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch details';
      error.value = `Error loading ${mediaType === 'movie' ? 'movie' : 'TV show'} details: ${errorMessage}`
      console.error('Error in fetchDetails:', err)
      throw error.value; // Re-throw to allow component to handle the error
    } finally {
      loading.value = false
    }
  }

  const fetchDetailsByImdbId = async (imdbId: string, mediaType: MediaType) => {
    try {
      loading.value = true
      error.value = null
      
      if (!imdbId) {
        throw new Error('No IMDB ID provided');
      }
      
      // First, search by IMDB ID to get the TMDB ID
      const searchResponse = await tmdb.find.byExternalId(imdbId, { external_source: 'imdb_id' });
      
      if (!searchResponse) {
        throw new Error('No response from TMDB API');
      }

      console.log('searchResponse', JSON.stringify(searchResponse))
      
      // Determine which type of media to get details for
      if (mediaType === 'movie') {
        const movieResults = searchResponse.movie_results?.[0];
        if (!movieResults) throw new Error('No movie found with this IMDB ID');
        return await fetchDetails(movieResults.id, 'movie');
      } else if (mediaType === 'tv') {
        const tvResults = searchResponse.tv_results?.[0] ?? searchResponse.tv_episode_results?.[0] ?? searchResponse.tv_season_results?.[0];
        if (!tvResults) throw new Error('No TV show found with this IMDB ID');
        return await fetchDetails(tvResults.show_id, 'tv');
      } else {
        throw new Error('Invalid media type');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch details by IMDB ID';
      error.value = `Error loading details: ${errorMessage}`
      console.error('Error in fetchDetailsByImdbId:', err)
      throw error.value;
    } finally {
      loading.value = false
    }
  }

  const getImageUrl = (path: string, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
  }

  const clearSearch = () => {
    searchResults.value = []
  }

  const fetchTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    try {
      loading.value = true
      const response = await tmdb.trending.trending(mediaType, timeWindow)
      trending.value = response.results.map((item: any) => ({
        ...item,
        media_type: item.media_type || (mediaType === 'all' ? (item.title ? 'movie' : 'tv') : mediaType)
      }))
      return trending.value
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
    loading,
    error,
    currentPage,
    totalPages,
    fetchPopularMovies,
    fetchPopularTVShows,
    fetchTrending,
    searchMulti,
    fetchDetails,
    fetchDetailsByImdbId,
    getImageUrl,
    clearSearch
  }
})