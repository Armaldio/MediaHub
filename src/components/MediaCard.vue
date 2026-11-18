<template>
  <button
    v-if="media"
    type="button"
    class="media-card"
    :aria-label="`Open ${title}`"
    @click="$emit('click')"
  >
    <span class="media-poster">
      <img v-if="posterUrl && !posterFailed" :src="posterUrl" alt="" width="342" height="513" loading="lazy" decoding="async" @error="posterFailed = true" />
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
  <div v-else class="media-card media-card--placeholder" aria-hidden="true">
    <span class="media-poster ui-skeleton"></span>
    <span class="media-caption">
      <span class="media-title"><span class="ui-skeleton block h-3 w-3/4"></span></span>
      <span class="media-meta"><span class="ui-skeleton block h-2.5 w-1/3"></span></span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Star, Film } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import { Movie, TV } from "tmdb-ts";

interface Props {
  media?: (Movie | TV) & { media_type?: string };
}

defineEmits<{
  click: [];
}>();

const props = defineProps<Props>();
const moviesStore = useMoviesStore();

const title = computed(() => {
  const media = props.media;
  if (!media) return "";
  return "title" in media ? media.title : media.name;
});

const posterUrl = computed(() => {
  return props.media?.poster_path
    ? moviesStore.getImageUrl(props.media.poster_path, "w342")
    : null;
});

const posterFailed = ref(false);
watch(posterUrl, () => { posterFailed.value = false; });

const rating = computed(() => props.media?.vote_average || 0);

const year = computed(() => {
  const media = props.media;
  if (!media) return null;
  const date = "release_date" in media ? media.release_date : media.first_air_date;
  return date ? new Date(date).getFullYear() : null;
});

const mediaTypeLabel = computed(() => {
  if (props.media?.media_type === "movie") return "Movie";
  if (props.media?.media_type === "tv") return "TV Show";
  return props.media && "title" in props.media ? "Movie" : "TV Show";
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
.media-card--placeholder {
  cursor: default;
  pointer-events: none;
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
  min-height: 3em;
  font-weight: 550;
}
.media-meta {
  display: block;
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 11px;
  min-height: 1.5em;
}
.media-card--placeholder .media-title > span,
.media-card--placeholder .media-meta > span {
  margin-top: 3px;
}
</style>
