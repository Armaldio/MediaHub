import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppendToResponse, MultiSearchResult, TMDB, MovieDetails, TvShowDetails, TrendingResults, Movie, PopularTvShowResult, MediaType } from 'tmdb-ts';

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
      let detailsResponse: AppendToResponse<TvShowDetails, "external_ids"[], "tvShow">
      | AppendToResponse<MovieDetails, "external_ids"[], "movie">;
      if (mediaType === 'movie') {
        detailsResponse = await tmdb.movies.details(id, ['external_ids']);
      } else if (mediaType === 'tv') {
        detailsResponse = await tmdb.tvShows.details(id, ['external_ids']);
      } else {
        throw new Error('Invalid media type');
      }
      
      currentDetails.value = detailsResponse
      return detailsResponse;
    } catch (err) {
      error.value = 'Failed to fetch details'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDetailsByImdbId = async (imdbId: string, mediaType: MediaType) => {
    try {
      loading.value = true;
      
      if (mediaType === 'movie') {
        // First, try to get the movie directly by IMDB ID
        try {
          const response = await tmdb.find.byExternalId(imdbId, {
            external_source: 'imdb_id'
          });
          
          if (!response) {
            throw new Error('Failed to fetch from TMDB API');
          }
          
          const movieResult = response.movie_results?.[0];
          
          if (!movieResult) {
            throw new Error('No movie found with this IMDB ID');
          }
          
          // Fetch the full details using the TMDB ID
          return await fetchDetails(movieResult.id, 'movie');
        } catch (err) {
          console.error('Error fetching movie by IMDB ID:', err);
          throw new Error('Failed to fetch movie details by IMDB ID');
        }
      } else if (mediaType === 'tv') {
        // First, try to get the TV show directly by IMDB ID
        try {
          const response = await tmdb.find.byExternalId(imdbId, {
            external_source: 'imdb_id'
          });
          
          if (!response) {
            throw new Error('Failed to fetch from TMDB API');
          }
          
          const tvResult = response.tv_results?.[0];
          
          if (!tvResult) {
            throw new Error('No TV show found with this IMDB ID');
          }
          
          // Fetch the full details using the TMDB ID
          return await fetchDetails(tvResult.id, 'tv');
        } catch (err) {
          console.error('Error fetching TV show by IMDB ID:', err);
          throw new Error('Failed to fetch TV show details by IMDB ID');
        }
      } else {
        throw new Error('Invalid media type');
      }
    } catch (err) {
      error.value = 'Failed to fetch details by IMDB ID';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
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