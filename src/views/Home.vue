<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header (fixed below the status bar; never scrolls under it) -->
    <header class="flex-shrink-0 z-50 bg-gray-900 border-b border-gray-800" style="padding-top: env(safe-area-inset-top, 0px)">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">Movie Hub</h1>
          <div class="flex space-x-2"> 
          <button
            @click="goToIntroduction"
            class="px-4 py-2 text-gray-300 hover:text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Manage Services
          </button>
          <button
            @click="goToSettings"
            class="px-4 py-2 text-gray-300 hover:text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <Cog class="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            
          </button>
        </div>
        </div>
        
        <!-- Search Bar -->
        <div class="mt-4 relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search movies and TV shows..."
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
          <Search class="absolute right-3 top-3 h-6 w-6 text-gray-400" />
          
          <!-- Clear Search -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-12 top-3 h-6 w-6 text-gray-400 hover:text-white transition-colors"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Filter Chips -->
        <div v-if="moviesStore.searchResults.length > 0" class="mt-3 flex gap-2">
          <button
            v-for="f in (['all','movie','tv'] as const)"
            :key="f"
            @click="filterType = f"
            class="px-3 py-1 rounded-full text-sm border transition-colors"
            :class="filterType === f ? 'bg-white text-gray-900 border-white' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'"
          >
            {{ f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV' }}
          </button>
        </div>

        <!-- Recent Searches -->
        <div v-if="!searchQuery && recentSearches.length > 0 && moviesStore.searchResults.length === 0" class="mt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500 uppercase tracking-wide">Recent</span>
            <button @click="clearRecent" class="text-xs text-gray-500 hover:text-gray-300">Clear</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in recentSearches"
              :key="r"
              @click="selectRecent(r)"
              class="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-700"
            >
              {{ r }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="py-12">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          <div v-for="i in 14" :key="`skeleton-${i}`" class="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"></div>
        </div>
      </div>

      <!-- Search Results -->
      <section v-else-if="moviesStore.searchResults.length > 0" class="mb-12">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-white">Search Results</h2>
          <span class="text-gray-400">{{ filteredResults.length }} results</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="item in filteredResults"
            :key="`search-${item.id}`"
            @click="goToDetails(item)"
            class="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <img
              v-if="getResultPoster(item)"
              :src="getResultPoster(item)"
              :alt="getResultTitle(item)"
              class="w-12 h-18 object-cover rounded-md bg-gray-800 flex-shrink-0"
            />
            <div v-else class="w-12 h-18 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
              <Film class="h-6 w-6 text-gray-500" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white font-medium truncate">
                {{ getResultTitle(item) }}
              </h3>
              <div class="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                <span v-if="getResultYear(item)">
                  {{ getResultYear(item) }}
                </span>
                <span v-if="(item as any).media_type" class="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                  {{ (item as any).media_type === 'movie' ? 'Movie' : 'TV' }}
                </span>
                <span v-if="getResultRating(item)" class="flex items-center gap-1">
                  <Star class="h-3 w-3 text-yellow-500 fill-current" />
                  {{ getResultRating(item).toFixed(1) }}
                </span>
              </div>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-500 flex-shrink-0" />
          </div>
        </div>
      </section>

      <!-- Popular Content -->
      <div v-else class="space-y-12">
        <!-- Popular Movies -->
        <section>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">Popular Movies</h2>
            <!-- <router-link 
              to="/movies" 
              class="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center"
            >
              View All <ChevronRight class="h-4 w-4 ml-1" />
            </router-link> -->
          </div>
          <div class="relative">
            <div class="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
              <MediaCard
                v-for="movie in moviesStore.popularMovies.slice(0, 14)"
                :key="`movie-${movie.id}`"
                :media="{ ...movie, media_type: 'movie' }"
                @click="goToDetails({ ...movie, media_type: 'movie' })"
                class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
              />
            </div>
          </div>
        </section>

        <!-- Popular TV Shows -->
        <section>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">Popular TV Shows</h2>
            <!-- <router-link 
              to="/tv" 
              class="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center"
            >
              View All <ChevronRight class="h-4 w-4 ml-1" />
            </router-link> -->
          </div>
          <div class="relative">
            <div class="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
              <MediaCard
                v-for="show in moviesStore.popularTVShows.slice(0, 14)"
                :key="`show-${show.id}`"
                :media="{ ...show, media_type: 'tv' } as (Movie | TV) & { media_type?: string }"
                @click="goToDetails({ ...show, media_type: 'tv' })"
                class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
              />
            </div>
          </div>
        </section>

        <!-- Trending This Week -->
        <section v-if="moviesStore.trending.length > 0">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">Trending This Week</h2>
            <!-- <router-link 
              to="/trending" 
              class="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center"
            >
              View All <ChevronRight class="h-4 w-4 ml-1" />
            </router-link> -->
          </div>
          <div class="relative">
            <div class="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
              <template v-for="item in moviesStore.trending.slice(0, 7)" :key="`trending-${item.id}-${item.media_type}`">
                <MediaCard
                  v-if="item.media_type === 'movie'"
                  :media="{
                    id: item.id,
                    title: item.title || '',
                    overview: item.overview || '',
                    poster_path: item.poster_path || '',
                    backdrop_path: item.backdrop_path || '',
                    release_date: item.release_date || '',
                    vote_average: item.vote_average || 0,
                    genre_ids: item.genre_ids || [],
                    original_title: item.original_title || '',
                    original_language: item.original_language || 'en',
                    adult: item.adult || false,
                    video: item.video || false,
                    vote_count: item.vote_count || 0,
                    popularity: item.popularity || 0
                  }"
                  @click="goToDetails({ media_type: 'movie', id: item.id })"
                  class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
                />
                <MediaCard
                  v-else-if="item.media_type === 'tv'"
                  :media="{
                    id: item.id,
                    name: item.name || '',
                    overview: item.overview || '',
                    poster_path: item.poster_path || '',
                    backdrop_path: item.backdrop_path || '',
                    first_air_date: item.first_air_date || '',
                    vote_average: item.vote_average || 0,
                    genre_ids: item.genre_ids || [],
                    origin_country: item.origin_country || [],
                    original_language: item.original_language || 'en',
                    original_name: item.original_name || '',
                    adult: item.adult || false,
                    popularity: item.popularity || 0,
                    vote_count: item.vote_count || 0
                  }"
                  @click="goToDetails({ media_type: 'tv', id: item.id })"
                  class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
                />
              </template>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, X, Cog, Film, Star, ChevronRight } from 'lucide-vue-next'
import { useMoviesStore } from '@/stores/movies'
import MediaCard from '@/components/MediaCard.vue'
import { MultiSearchResult, Movie, TV } from 'tmdb-ts'

const router = useRouter()
const route = useRoute()
const moviesStore = useMoviesStore()
const searchQuery = ref('')
const filterType = ref<'all' | 'movie' | 'tv'>('all')
const recentSearches = ref<string[]>(JSON.parse(localStorage.getItem('recentSearches') || '[]'))
let searchTimeout: ReturnType<typeof setTimeout>

const saveRecent = (q: string) => {
  const normalized = q.trim()
  if (!normalized || normalized.length < 2) return
  const next = [normalized, ...recentSearches.value.filter(s => s.toLowerCase() !== normalized.toLowerCase())].slice(0, 10)
  recentSearches.value = next
  localStorage.setItem('recentSearches', JSON.stringify(next))
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    const q = searchQuery.value.trim()
    if (q) saveRecent(q)
    moviesStore.searchMulti(q)
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  moviesStore.clearSearch()
}

const filteredResults = computed(() => {
  if (filterType.value === 'all') return moviesStore.searchResults
  return moviesStore.searchResults.filter(r => r.media_type === filterType.value)
})

const getResultPoster = (item: MultiSearchResult) => {
  const path = (item as any).poster_path as string | null | undefined
  if (!path) return undefined
  return moviesStore.getImageUrl(path, 'w92') as string | undefined
}

const getResultTitle = (item: MultiSearchResult) => {
  return (item as any).title || (item as any).name || ''
}

const getResultYear = (item: MultiSearchResult) => {
  const date = (item as any).release_date || (item as any).first_air_date || ''
  return date ? new Date(date).getFullYear() : null
}

const getResultRating = (item: MultiSearchResult) => {
  return (item as any).vote_average || 0
}

const selectRecent = (q: string) => {
  searchQuery.value = q
  moviesStore.searchMulti(q)
}

const clearRecent = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

watch(() => route.query.q, (q) => {
  if (typeof q === 'string' && q) {
    searchQuery.value = q
    moviesStore.searchMulti(q)
  }
}, { immediate: true })

const goToDetails = (item: { id: number; media_type: string }) => {
  const mediaType = item.media_type
  router.push({name: 'details-tmdb', params: { mediaType, tmdbId: item.id }})
}

const goToSettings = () => {
  router.push({
    name: 'settings'
  })
}

const goToIntroduction = () => {
  router.push({
    name: 'introduction',
    query: {
      force: '1'
    }
  })
}

// Fetch initial data
const fetchInitialData = async () => {
  try {
    await Promise.all([
      moviesStore.fetchPopularMovies(),
      moviesStore.fetchPopularTVShows(),
      moviesStore.fetchTrending('all', 'week')
    ])
  } catch (error) {
    console.error('Error fetching initial data:', error)
  }
}

// Functions for loading more content can be implemented here when needed
// Currently using View All links for better UX

// Fetch data when component mounts
onMounted(fetchInitialData)
</script>