<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass-effect border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold gradient-text">Movie Hub</h1>
          <button
            @click="goToIntroduction"
            class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Manage Services
          </button>
        </div>
        
        <!-- Search Bar -->
        <div class="mt-4 relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search movies and TV shows..."
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
          >
          <Search class="absolute right-3 top-3 h-6 w-6 text-gray-400" />
          
          <!-- Clear Search -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-12 top-3 h-6 w-6 text-gray-400 hover:text-white"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Search Results -->
      <section v-else-if="moviesStore.searchResults.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">Search Results</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <MediaCard
            v-for="item in moviesStore.searchResults"
            :key="`${item.id}`"
            :media="item"
            @click="goToDetails(item)"
          />
        </div>
      </section>

      <!-- Popular Content -->
      <div v-else>
        <!-- Popular Movies -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Popular Movies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <MediaCard
              v-for="movie in moviesStore.popularMovies"
              :key="movie.id"
              :media="{ ...movie, media_type: 'movie' }"
              @click="goToDetails({ ...movie, media_type: 'movie' })"
            />
          </div>
        </section>

        <!-- Popular TV Shows -->
        <section>
          <h2 class="text-2xl font-bold text-white mb-6">Popular TV Shows</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <MediaCard
              v-for="show in moviesStore.popularTVShows"
              :key="show.id"
              :media="{ ...show, media_type: 'tv' }"
              @click="goToDetails({ ...show, media_type: 'tv' })"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import { useMoviesStore } from '@/stores/movies'
import MediaCard from '@/components/MediaCard.vue'

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

const goToDetails = (item: any) => {
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv')
  router.push(`/details/${mediaType}/${item.id}`)
}

const goToIntroduction = () => {
  router.push({
    name: 'introduction',
    query: {
      force: '1'
    }
  })
}

onMounted(async () => {
  await Promise.all([
    moviesStore.fetchPopularMovies(),
    moviesStore.fetchPopularTVShows()
  ])
})
</script>