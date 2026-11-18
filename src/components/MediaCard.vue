<template>
  <button
    type="button"
    class="media-card"
    :aria-label="`Open ${title}`"
    @click="$emit('click')"
  >
    <span class="media-poster">
      <img v-if="posterUrl" :src="posterUrl" alt="" loading="lazy" />
      <span v-else class="poster-placeholder"
        ><Film :size="32" :stroke-width="1.5" aria-hidden="true"
      /></span>
      <span v-if="rating" class="media-rating"
        ><Star :size="11" class="text-warning" aria-hidden="true" />{{
          rating.toFixed(1)
        }}</span
      >
    </span>
    <span class="media-caption">
      <span class="media-title">{{ title }}</span>
      <span class="media-meta"
        >{{ mediaTypeLabel
        }}<template v-if="year"> · {{ year }}</template></span
      >
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Star, Film } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import { Movie, TV } from "tmdb-ts";

interface Props {
  media: (Movie | TV) & { media_type?: string };
}

defineEmits<{
  click: [];
}>();

const props = defineProps<Props>();
const moviesStore = useMoviesStore();

const title = computed(() => {
  return "title" in props.media ? props.media.title : props.media.name;
});

const posterUrl = computed(() => {
  return props.media.poster_path
    ? moviesStore.getImageUrl(props.media.poster_path, "w342")
    : null;
});

const rating = computed(() => props.media.vote_average || 0);

const year = computed(() => {
  const date =
    "release_date" in props.media
      ? props.media.release_date
      : props.media.first_air_date;
  return date ? new Date(date).getFullYear() : null;
});

const mediaTypeLabel = computed(() => {
  if (props.media.media_type === "movie") return "Movie";
  if (props.media.media_type === "tv") return "TV Show";
  return "title" in props.media ? "Movie" : "TV Show";
});
</script>
<style scoped>
.media-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0;
  background: var(--color-surface);
  color: var(--color-ink);
  text-align: left;
  border: 1px solid var(--color-line-soft);
  border-radius: var(--radius-panel);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--duration-ui);
}
.media-card:hover {
  border-color: var(--color-accent);
}
.media-poster {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--color-raised);
}
.media-poster > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.poster-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--color-subtle);
}
.media-rating {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 5px;
  background: var(--color-scrim);
  color: var(--color-ink);
  font-size: 11px;
}
.media-caption {
  padding: 12px;
  width: 100%;
}
.media-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 550;
}
.media-meta {
  display: block;
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 11px;
}
</style>
