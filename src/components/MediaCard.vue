<template>
  <div class="group cursor-pointer card-hover" @click="$emit('click')">
    <div class="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg h-full flex flex-col">
      <!-- Poster Container -->
      <div class="aspect-[2/3] relative overflow-hidden">
        <!-- Image with zoom effect -->
        <div class="w-full h-full overflow-hidden">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="title"
            class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
            <Film class="h-8 w-8 text-gray-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-2 left-2 right-2">
            <div class="flex items-center justify-between text-white text-sm">
              <span v-if="rating" class="flex items-center gap-1">
                <Star class="h-4 w-4 text-yellow-500 fill-current" />
                {{ rating.toFixed(1) }}
              </span>
              <span v-if="year" class="bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{{ year }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Info -->
      <div class="p-3">
        <h3 class="text-white font-medium text-sm line-clamp-2 group-hover:text-primary-400 transition-colors duration-300">
          {{ title }}
        </h3>
        <p v-if="mediaTypeLabel" class="text-gray-400 text-xs mt-1">{{ mediaTypeLabel }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, Film } from 'lucide-vue-next'
import { useMoviesStore } from '@/stores/movies'
import type { Movie, TVShow } from '@/types'

interface Props {
  media: (Movie | TVShow) & { media_type?: string }
}

defineEmits<{
  click: []
}>()

const props = defineProps<Props>()
const moviesStore = useMoviesStore()

const title = computed(() => {
  return 'title' in props.media ? props.media.title : props.media.name
})

const posterUrl = computed(() => {
  return props.media.poster_path ? moviesStore.getImageUrl(props.media.poster_path, 'w342') : null
})

const rating = computed(() => props.media.vote_average || 0)

const year = computed(() => {
  const date = 'release_date' in props.media ? props.media.release_date : props.media.first_air_date
  return date ? new Date(date).getFullYear() : null
})

const mediaTypeLabel = computed(() => {
  if (props.media.media_type === 'movie') return 'Movie'
  if (props.media.media_type === 'tv') return 'TV Show'
  return 'title' in props.media ? 'Movie' : 'TV Show'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>