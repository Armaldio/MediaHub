import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Movie, TVShow, MovieDetails, TVShowDetails, ExternalIds, MediaType, TrendingItem } from '@/types'

const TMDB_API_KEY = '8265bd1679663a7ea12ac168da84d2e8' // Demo key - replace with your own
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export const useMoviesStore = defineStore('movies', () => {
  const popularMovies = ref<Movie[]>([])
  const popularTVShows = ref<TVShow[]>([])
  const trending = ref<TrendingItem[]>([])
  const searchResults = ref<(Movie | TVShow)[]>([])
  const currentDetails = ref<MovieDetails | TVShowDetails | null>(null)
  const currentExternalIds = ref<ExternalIds | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY
    }
  })

  const fetchPopularMovies = async (page = 1) => {
    try {
      loading.value = true
      const response = await api.get('/movie/popular', {
        params: { page }
      })
      
      if (page === 1) {
        popularMovies.value = response.data.results
      } else {
        popularMovies.value = [...popularMovies.value, ...response.data.results]
      }
      
      currentPage.value = response.data.page
      totalPages.value = response.data.total_pages
      return response.data.results
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
      const response = await api.get('/tv/popular', {
        params: { page }
      })
      
      if (page === 1) {
        popularTVShows.value = response.data.results
      } else {
        popularTVShows.value = [...popularTVShows.value, ...response.data.results]
      }
      
      currentPage.value = response.data.page
      totalPages.value = response.data.total_pages
      return response.data.results
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
      const response = await api.get('/search/multi', {
        params: { query }
      })
      searchResults.value = response.data.results.filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
      )
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
      const [detailsResponse, externalIdsResponse] = await Promise.all([
        api.get(`/${mediaType}/${id}`),
        api.get(`/${mediaType}/${id}/external_ids`)
      ])
      
      currentDetails.value = detailsResponse.data
      currentExternalIds.value = externalIdsResponse.data
    } catch (err) {
      error.value = 'Failed to fetch details'
      console.error(err)
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
      const response = await api.get(`/trending/${mediaType}/${timeWindow}`)
      trending.value = response.data.results.map((item: any) => ({
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
    currentExternalIds,
    loading,
    error,
    currentPage,
    totalPages,
    fetchPopularMovies,
    fetchPopularTVShows,
    fetchTrending,
    searchMulti,
    fetchDetails,
    getImageUrl,
    clearSearch
  }
})