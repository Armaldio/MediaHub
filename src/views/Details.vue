<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="moviesStore.loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Content -->
    <div v-else-if="moviesStore.currentDetails" class="relative">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="fixed top-4 left-4 z-50 p-3 glass-effect rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>

      <!-- Hero Section -->
      <div class="relative h-screen">
        <!-- Backdrop -->
        <div
          v-if="backdrop"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${backdrop})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="relative h-full flex items-end">
          <div class="max-w-7xl mx-auto px-4 pb-16 w-full">
            <div class="flex flex-col lg:flex-row items-start gap-8">
              <!-- Poster -->
              <div class="flex-shrink-0">
                <img
                  v-if="poster"
                  :src="poster"
                  :alt="title"
                  class="w-64 h-96 object-cover rounded-xl shadow-2xl"
                >
                <div v-else class="w-64 h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                  <Film class="h-16 w-16 text-gray-600" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-white">
                <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ title }}</h1>
                
                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                  <span v-if="releaseYear" class="text-lg">{{ releaseYear }}</span>
                  <span v-if="rating" class="flex items-center gap-1">
                    <Star class="h-5 w-5 text-yellow-500 fill-current" />
                    {{ rating.toFixed(1) }}
                  </span>
                  <span v-if="runtime" class="text-lg">{{ runtime }}</span>
                </div>

                <!-- Genres -->
                <div v-if="genres.length > 0" class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="genre in genres"
                    :key="genre.id"
                    class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
                  >
                    {{ genre.name }}
                  </span>
                </div>

                <!-- Overview -->
                <p v-if="overview" class="text-lg text-gray-200 leading-relaxed max-w-3xl">
                  {{ overview }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Section -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Open in your apps & services</h2>
          <div class="text-sm text-gray-400">
            {{ availableSelectedServices.length }} of {{ servicesStore.selectedServices.length }} available
          </div>
        </div>

        <!-- Services by Category -->
        <div v-for="category in categoriesWithServices" :key="category.id" class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">{{ category.icon }}</span>
            <h3 class="text-lg font-semibold text-white">{{ category.name }}</h3>
            <span class="text-sm text-gray-400">({{ category.services.length }})</span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              v-for="service in category.services"
              :key="service.id"
              @click="openInService(service)"
              class="group p-4 glass-effect rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 text-left relative"
              :class="{ 'opacity-60': !servicesStore.isServiceInstalled(service) }"
            >
              <!-- Installation status indicator -->
              <div class="absolute top-2 right-2">
                <div
                  v-if="servicesStore.isServiceInstalled(service)"
                  class="w-2 h-2 bg-green-500 rounded-full"
                  title="Available"
                ></div>
                <div
                  v-else
                  class="w-2 h-2 bg-gray-500 rounded-full"
                  title="Not installed"
                ></div>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-2xl">{{ service.icon }}</div>
                <div class="flex-1">
                  <h4 class="text-white font-semibold group-hover:text-primary-400 transition-colors text-sm">
                    {{ service.name }}
                  </h4>
                  <p class="text-gray-400 text-xs">{{ getServiceActionText(service) }}</p>
                </div>
              </div>
              <div
                class="mt-3 h-1 rounded-full opacity-60"
                :style="{ backgroundColor: service.color }"
              ></div>
            </button>
          </div>
        </div>

        <!-- No services message -->
        <div v-if="availableSelectedServices.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📱</div>
          <h3 class="text-xl font-semibold text-white mb-2">No services selected</h3>
          <p class="text-gray-400 mb-6">Go back to the introduction to select your movie apps and services.</p>
          <button
            @click="goToIntroduction"
            class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Select Services
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Star, Film } from 'lucide-vue-next'
import { useMoviesStore } from '@/stores/movies'
import { useServicesStore } from '@/stores/services'
import type { Service, MediaType, ServiceCategory } from '@/types'

interface Props {
  mediaType: MediaType
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const moviesStore = useMoviesStore()
const servicesStore = useServicesStore()

const title = computed(() => {
  const details = moviesStore.currentDetails
  if (!details) return ''
  return 'title' in details ? details.title : details.name
})

const overview = computed(() => moviesStore.currentDetails?.overview || '')

const poster = computed(() => {
  const path = moviesStore.currentDetails?.poster_path
  return path ? moviesStore.getImageUrl(path, 'w500') : null
})

const backdrop = computed(() => {
  const path = moviesStore.currentDetails?.backdrop_path
  return path ? moviesStore.getImageUrl(path, 'w1280') : null
})

const releaseYear = computed(() => {
  const details = moviesStore.currentDetails
  if (!details) return null
  
  const date = 'release_date' in details ? details.release_date : details.first_air_date
  return date ? new Date(date).getFullYear() : null
})

const rating = computed(() => moviesStore.currentDetails?.vote_average || 0)

const runtime = computed(() => {
  const details = moviesStore.currentDetails
  if (!details) return null
  
  if ('runtime' in details && details.runtime) {
    const hours = Math.floor(details.runtime / 60)
    const minutes = details.runtime % 60
    return `${hours}h ${minutes}m`
  }
  
  return null
})

const genres = computed(() => moviesStore.currentDetails?.genres || [])

const availableSelectedServices = computed(() => 
  servicesStore.selectedServices.filter(service => 
    servicesStore.isServiceInstalled(service)
  )
)

const categoriesWithServices = computed(() => {
  const categories: Array<{ id: ServiceCategory; name: string; icon: string; services: Service[] }> = []
  
  servicesStore.serviceCategories.forEach(categoryInfo => {
    const categoryServices = availableSelectedServices.value.filter(
      service => service.category === categoryInfo.id
    )
    
    if (categoryServices.length > 0) {
      categories.push({
        id: categoryInfo.id,
        name: categoryInfo.name,
        icon: categoryInfo.icon,
        services: categoryServices
      })
    }
  })
  
  return categories
})

const getServiceActionText = (service: Service) => {
  if (!servicesStore.isServiceInstalled(service)) {
    return 'Not installed'
  }
  if (service.androidAppId) {
    return 'Open in app'
  }
  return 'Open website'
}

const openInService = (service: Service) => {
  if (!servicesStore.isServiceInstalled(service)) {
    // Redirect to app store
    window.open(service.appUrl, '_blank')
    return
  }

  // Generate deep link based on available IDs
  const tmdbId = props.id
  const imdbId = moviesStore.currentExternalIds?.imdb_id
  const tvdbId = moviesStore.currentExternalIds?.tvdb_id
  const wikidataId = moviesStore.currentExternalIds?.wikidata_id

  // Find appropriate deep link pattern
  let deepLinkUrl = null
  
  for (const deepLink of service.deepLinks) {
    switch (deepLink.type) {
      case 'tmdb':
        deepLinkUrl = deepLink.pattern.replace('{tmdb_id}', tmdbId)
        break
      case 'imdb':
        if (imdbId) {
          deepLinkUrl = deepLink.pattern.replace('{imdb_id}', imdbId)
        }
        break
      case 'tvdb':
        if (tvdbId) {
          deepLinkUrl = deepLink.pattern.replace('{tvdb_id}', tvdbId.toString())
        }
        break
      case 'wikidata':
        if (wikidataId) {
          deepLinkUrl = deepLink.pattern.replace('{wikidata_id}', wikidataId)
        }
        break
    }
    
    if (deepLinkUrl) break
  }

  if (deepLinkUrl) {
    // For web URLs (like Wikidata, TVDB), open directly
    if (deepLinkUrl.startsWith('http')) {
      window.open(deepLinkUrl, '_blank')
      return
    }
    
    // Try to open deep link for mobile apps
    window.location.href = deepLinkUrl
    
    // Fallback to app store after a short delay for mobile apps
    if (service.androidAppId) {
      setTimeout(() => {
        window.open(service.appUrl, '_blank')
      }, 1000)
    }
  } else {
    // Fallback to service website
    window.open(service.websiteUrl, '_blank')
  }
}

const goBack = () => {
  router.push('/home')
}

const goToIntroduction = () => {
  router.push('/')
}

onMounted(async () => {
  await moviesStore.fetchDetails(parseInt(props.id), props.mediaType)
})
</script>