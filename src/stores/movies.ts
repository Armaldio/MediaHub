import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Movie, TVShow, MovieDetails, TVShowDetails, ExternalIds, MediaType } from '@/types'

const TMDB_API_KEY = '8265bd1679663a7ea12ac168da84d2e8' // Demo key - replace with your own
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export const useMoviesStore = defineStore('movies', () => {
  const popularMovies = ref<Movie[]>([])
  const popularTVShows = ref<TVShow[]>([])
  const searchResults = ref<(Movie | TVShow)[]>([])
  const currentDetails = ref<MovieDetails | TVShowDetails | null>(null)
  const currentExternalIds = ref<ExternalIds | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY
    }
  })

  const fetchPopularMovies = async () => {
    try {
      loading.value = true
      const response = await api.get('/movie/popular')
      popularMovies.value = response.data.results
    } catch (err) {
      error.value = 'Failed to fetch popular movies'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchPopularTVShows = async () => {
    try {
      loading.value = true
      const response = await api.get('/tv/popular')
      popularTVShows.value = response.data.results
    } catch (err) {
      error.value = 'Failed to fetch popular TV shows'
      console.error(err)
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

  return {
    popularMovies,
    popularTVShows,
    searchResults,
    currentDetails,
    currentExternalIds,
    loading,
    error,
    fetchPopularMovies,
    fetchPopularTVShows,
    searchMulti,
    fetchDetails,
    getImageUrl,
    clearSearch
  }
})