<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Safe Area Top -->
    <div class="h-safe-top"></div>
    
    <!-- Header -->
    <header class="sticky top-0 z-50 glass-effect border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold gradient-text">Movie Hub</h1>
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
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="py-12">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          <div v-for="i in 14" :key="`skeleton-${i}`" class="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"></div>
        </div>
      </div>

      <!-- Search Results -->
      <section v-else-if="moviesStore.searchResults.length > 0" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Search Results</h2>
          <span class="text-gray-400">{{ moviesStore.searchResults.length }} results</span>
        </div>
        <div class="relative">
          <div class="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
            <MediaCard
              v-for="item in moviesStore.searchResults.slice(0, 14)"
              :key="`search-${item.id}`"
              :media="item"
              @click="goToDetails(item)"
              class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
            />
          </div>
        </div>
        <div v-if="moviesStore.searchResults.length > 14" class="mt-6 text-center">
          <button class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Load More Results
          </button>
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
                :media="{ ...show, media_type: 'tv' }"
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
                    adult: item.adult || false,
                    video: item.video || false,
                    vote_count: item.vote_count || 0,
                    popularity: item.popularity || 0
                  }"
                  @click="goToDetails({
                    id: item.id,
                    media_type: 'movie',
                    title: item.title || '',
                    release_date: item.release_date
                  })"
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
                    popularity: item.popularity || 0,
                    vote_count: item.vote_count || 0
                  }"
                  @click="goToDetails({
                    id: item.id,
                    media_type: 'tv',
                    title: item.name || '',
                    first_air_date: item.first_air_date
                  })"
                  class="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-200"
                />
              </template>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <!-- Safe Area Bottom -->
    <div class="h-safe-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Cog } from 'lucide-vue-next'
import { useMoviesStore } from '@/stores/movies'
import MediaCard from '@/components/MediaCard.vue'
import { MultiSearchResult } from 'tmdb-ts'

const router = useRouter()
const moviesStore = useMoviesStore()
const searchQuery = ref('')
let searchTimeout: number

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    moviesStore.searchMulti(searchQuery.value)
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  moviesStore.clearSearch()
}

const goToDetails = (item: MultiSearchResult) => {
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
      moviesStore.fetchPopularMovies(1),
      moviesStore.fetchPopularTVShows(1),
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