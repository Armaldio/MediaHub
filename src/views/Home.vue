<template>
  <div class="ui-page">
    <AppHeader>
      <button
        type="button"
        @click="goToIntroduction"
        class="ui-button ui-button--ghost manage-services"
        aria-label="Manage services"
        title="Manage services"
      >
        <span class="hidden sm:inline">Manage services</span>
        <SlidersHorizontal :size="19" class="sm:hidden" aria-hidden="true" />
      </button>
      <button
        type="button"
        @click="goToSettings"
        class="ui-button ui-button--ghost ui-icon-button"
        aria-label="Settings"
      >
        <Cog :size="19" aria-hidden="true" />
      </button>
    </AppHeader>
    <main class="ui-container home-content">
      <div class="ui-page-intro">
        <h1 class="ui-title">Find your next favorite.</h1>
        <p class="ui-description">
          Discover something good. Open it with the services you love.
        </p>
      </div>
      <div class="home-search">
        <label class="ui-search">
          <Search :size="18" aria-hidden="true" />
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="search"
            aria-label="Search movies and TV shows"
            placeholder="Search movies and TV shows…"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="clearSearch"
            class="ui-button ui-button--ghost ui-icon-button"
            aria-label="Clear search"
          >
            <X :size="17" aria-hidden="true" />
          </button>
        </label>
        <nav
          v-if="moviesStore.searchResults.length"
          class="ui-tabs mt-3"
          aria-label="Search result types"
        >
          <button
            v-for="f in (['all','movie','tv'] as const)"
            :key="f"
            @click="filterType = f"
            class="ui-chip"
            :aria-pressed="filterType === f"
          >
            {{ f === "all" ? "All" : f === "movie" ? "Movies" : "TV" }}
          </button>
        </nav>
        <div
          v-if="
            !searchQuery &&
            recentSearches.length &&
            !moviesStore.searchResults.length
          "
          class="mt-4"
        >
          <div
            class="flex items-center justify-between mb-2 text-xs text-subtle"
          >
            <span>Recently searched</span>
            <button @click="clearRecent" class="ui-link">Clear</button>
          </div>
          <div class="ui-tabs">
            <button
              v-for="r in recentSearches"
              :key="r"
              @click="selectRecent(r)"
              class="ui-chip border-line"
            >
              {{ r }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="moviesStore.loading"
        class="media-grid"
        role="status"
        aria-label="Loading titles"
      >
        <div
          v-for="i in 12"
          :key="i"
          class="aspect-[2/3] bg-surface rounded-panel animate-pulse"
        ></div>
      </div>
      <section
        v-else-if="moviesStore.searchResults.length"
        aria-label="Search results"
      >
        <div class="ui-section-heading">
          <h2 class="ui-section-title">Search results</h2>
          <span class="text-xs text-subtle">
            {{ filteredResults.length }} results
          </span>
        </div>
        <div v-if="!filteredResults.length" class="ui-empty">
          <h3>No titles in this category</h3>
          <p>Try a different filter.</p>
          <button @click="filterType = 'all'" class="ui-button">
            Show all results
          </button>
        </div>
        <div v-else class="search-results">
          <button
            v-for="item in filteredResults"
            :key="`search-${item.id}`"
            @click="goToDetails(item)"
            class="search-result"
          >
            <img
              v-if="getResultPoster(item)"
              :src="getResultPoster(item)"
              alt=""
              class="result-poster"
            />
            <span v-else class="result-poster result-placeholder">
              <Film :size="22" aria-hidden="true" />
            </span>
            <span class="flex-1 min-w-0 text-left">
              <span class="block text-ink font-medium truncate">
                {{ getResultTitle(item) }}
              </span>
              <span
                class="flex flex-wrap items-center gap-2 text-xs text-muted mt-1"
              >
                <span v-if="getResultYear(item)">
                  {{ getResultYear(item) }}
                </span>
                <span class="ui-badge">
                  {{ item.media_type === "movie" ? "Movie" : "TV" }}
                </span>
                <span
                  v-if="getResultRating(item)"
                  class="inline-flex items-center gap-1"
                >
                  <Star :size="12" class="text-warning" />
                  {{ getResultRating(item).toFixed(1) }}
                </span>
              </span>
            </span>
            <ChevronRight :size="18" class="text-subtle" aria-hidden="true" />
          </button>
        </div>
      </section>
      <div
        v-else-if="searchQuery.trim().length >= 2"
        class="ui-empty"
        role="status"
      >
        <Search :size="28" aria-hidden="true" />
        <h2>No titles found</h2>
        <p>Try another title or a different spelling.</p>
        <button @click="clearSearch" class="ui-button">Clear search</button>
      </div>
      <div v-else class="home-shelves">
        <section v-for="shelf in shelves" :key="shelf.title">
          <div class="ui-section-heading">
            <h2 class="ui-section-title">{{ shelf.title }}</h2>
            <span class="text-xs text-subtle">{{ shelf.caption }}</span>
          </div>
          <div v-if="shelf.items.length" class="media-grid">
            <MediaCard
              v-for="item in shelf.items"
              :key="`${item.media_type}-${item.id}`"
              :media="item as (Movie | TV) & { media_type: string }"
              @click="goToDetails(item)"
            />
          </div>
          <div v-else class="ui-empty">
            <Film :size="26" aria-hidden="true" />
            <h3>No titles available</h3>
            <p>Check your connection and try again.</p>
            <button @click="fetchInitialData" class="ui-button">
              Try again
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Search, X, Cog, Film, Star, ChevronRight, SlidersHorizontal } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import MediaCard from "@/components/MediaCard.vue";
import AppHeader from "@/components/AppHeader.vue";
import { loadRecentSearches } from "@/utils/recentSearches";
import { MultiSearchResult, Movie, TV } from "tmdb-ts";

const router = useRouter();
const route = useRoute();
const moviesStore = useMoviesStore();
const shelves = computed(() => [
  {
    title: "Popular movies",
    caption: "Worth a watch",
    items: moviesStore.popularMovies
      .slice(0, 12)
      .map((movie) => ({ ...movie, media_type: "movie" })),
  },
  {
    title: "Popular TV shows",
    caption: "Your next obsession",
    items: moviesStore.popularTVShows
      .slice(0, 12)
      .map((show) => ({ ...show, media_type: "tv" })),
  },
  {
    title: "Trending this week",
    caption: "In the conversation",
    items: moviesStore.trending
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 6),
  },
]);
const searchQuery = ref("");
const filterType = ref<"all" | "movie" | "tv">("all");
const recentSearches = ref<string[]>(loadRecentSearches());
let searchTimeout: ReturnType<typeof setTimeout>;

const saveRecent = (q: string) => {
  const normalized = q.trim();
  if (!normalized || normalized.length < 2) return;
  const next = [
    normalized,
    ...recentSearches.value.filter(
      (s) => s.toLowerCase() !== normalized.toLowerCase()
    ),
  ].slice(0, 10);
  recentSearches.value = next;
  localStorage.setItem("recentSearches", JSON.stringify(next));
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const q = searchQuery.value.trim();
    if (q) saveRecent(q);
    moviesStore.searchMulti(q);
  }, 300);
};

const clearSearch = () => {
  clearTimeout(searchTimeout);
  searchQuery.value = "";
  moviesStore.clearSearch();
};

const filteredResults = computed(() => {
  if (filterType.value === "all") return moviesStore.searchResults;
  return moviesStore.searchResults.filter(
    (r) => r.media_type === filterType.value
  );
});

const getResultPoster = (item: MultiSearchResult) => {
  const path = (item as any).poster_path as string | null | undefined;
  if (!path) return undefined;
  return moviesStore.getImageUrl(path, "w92") as string | undefined;
};

const getResultTitle = (item: MultiSearchResult) => {
  return (item as any).title || (item as any).name || "";
};

const getResultYear = (item: MultiSearchResult) => {
  const date = (item as any).release_date || (item as any).first_air_date || "";
  return date ? new Date(date).getFullYear() : null;
};

const getResultRating = (item: MultiSearchResult) => {
  return (item as any).vote_average || 0;
};

const selectRecent = (q: string) => {
  clearTimeout(searchTimeout);
  searchQuery.value = q;
  moviesStore.searchMulti(q);
};

const clearRecent = () => {
  recentSearches.value = [];
  localStorage.removeItem("recentSearches");
};

watch(
  () => route.query.q,
  (q) => {
    if (typeof q === "string" && q) {
      searchQuery.value = q;
      moviesStore.searchMulti(q);
    }
  },
  { immediate: true }
);

const goToDetails = (item: { id: number; media_type: string }) => {
  const mediaType = item.media_type;
  router.push({ name: "details-tmdb", params: { mediaType, tmdbId: item.id } });
};

const goToSettings = () => {
  router.push({
    name: "settings",
  });
};

const goToIntroduction = () => {
  router.push({
    name: "introduction",
    query: {
      force: "1",
    },
  });
};

// Fetch initial data
const fetchInitialData = async () => {
  try {
    await Promise.all([
      moviesStore.fetchPopularMovies(),
      moviesStore.fetchPopularTVShows(),
      moviesStore.fetchTrending("all", "week"),
    ]);
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
};

// Fetch data when component mounts
onMounted(fetchInitialData);
onUnmounted(() => {
  clearTimeout(searchTimeout);
  moviesStore.clearSearch();
});
</script>

<style scoped>
.home-search {
  max-width: 680px;
  margin-bottom: 32px;
}
.home-shelves {
  display: grid;
  gap: 36px;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}
.search-results {
  display: grid;
  gap: 8px;
  max-width: 800px;
}
.search-result {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-line-soft);
  border-radius: var(--radius-panel);
  cursor: pointer;
}
.search-result:hover {
  border-color: var(--color-accent-line);
  background: var(--color-hover);
}
.result-poster {
  width: 44px;
  height: 66px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}
.result-placeholder {
  display: grid;
  place-items: center;
  background: var(--color-raised);
  color: var(--color-subtle);
}
@media (max-width: 900px) {
  .media-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 580px) {
  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .ui-section-heading > span {
    display: none;
  }
  .manage-services {
    padding-inline: 8px;
    font-size: 12px;
  }
}
</style>
