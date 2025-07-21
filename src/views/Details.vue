<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Safe Area Top -->
    <div class="h-safe-top"></div>

    <!-- Loading State -->
    <div
      v-if="moviesStore.loading"
      class="flex flex-col justify-center items-center min-h-screen-safe p-8 text-center"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"
      ></div>
      <p class="text-gray-300">Loading details...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="flex flex-col items-center justify-center min-h-screen-safe p-8 text-center"
    >
      <div
        class="bg-red-900/30 border border-red-800 rounded-xl p-6 max-w-2xl w-full"
      >
        <div class="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p class="text-gray-300 mb-6">{{ errorMessage }}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="retryLoading"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            @click="goBack"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="moviesStore.currentDetails" class="relative">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="fixed z-50 p-3 glass-effect rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all"
        :style="backButtonStyle"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>

      <!-- Hero Section with Parallax -->
      <div class="relative h-screen overflow-hidden backdrop">
        <!-- Parallax Backdrop -->
        <div
          v-if="backdrop"
          ref="parallaxBackdrop"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
          :style="{
            backgroundImage: `url(${backdrop})`,
            transform: `scale(1.1) translateY(${parallaxOffset * 0.5}px)`,
          }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"
          ></div>
        </div>

        <!-- Content -->
        <div class="relative h-full flex items-end">
          <div class="max-w-7xl mx-auto px-4 pb-16 w-full">
            <div class="flex flex-col lg:flex-row items-start gap-8 mb-8">
              <!-- Poster -->
              <div class="flex-shrink-0">
                <img
                  v-if="poster"
                  :src="poster"
                  :alt="formattedDetails?.title || 'Media poster'"
                  class="w-64 h-96 object-cover rounded-xl shadow-2xl"
                />
                <div
                  v-else
                  class="w-64 h-96 bg-gray-800 rounded-xl flex items-center justify-center"
                >
                
                <Film class="h-16 w-16 text-gray-600" />
              </div>
            </div>
            
            <!-- Info -->
            <div class="flex-1 text-white">

                <h1 class="text-4xl md:text-6xl font-bold mb-4">
                  {{ formattedDetails?.title || 'Untitled' }}
                </h1>

                <!-- Meta Info -->
                <div
                  class="flex flex-wrap items-center gap-4 mb-6 text-gray-300"
                >
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
                <p
                  v-if="overview"
                  class="text-lg text-gray-200 leading-relaxed max-w-3xl"
                >
                  {{ overview }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gradient transition -->
      <div
        class="relative z-10 h-24 -mt-24 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent pointer-events-none"
      ></div>

      <!-- Services Section -->
      <div class="relative z-20 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-white mb-1">Open with</h2>
              <p class="text-gray-400 text-sm">
                Your connected services
              </p>
            </div>
            <div
              class="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
            >
              {{ servicesStore.selectedServices.length }} services
            </div>
          </div>

          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search services..."
              />
            </div>
          </div>

          <!-- Quick Access Icons -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-300 mb-3">Quick Access</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="service in filteredServices"
                :key="service.id"
                @click="scrollToService(service.id)"
                class="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                :title="service.name"
              >
                <img
                  v-if="service.icon"
                  :src="service.icon"
                  :alt="service.name"
                  class="w-6 h-6 object-contain"
                />
                <span v-else class="text-xs text-white">{{ service.name.charAt(0) }}</span>
              </button>
            </div>
          </div>

          <!-- Services Grid -->
          <div
            ref="servicesGrid"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-for="service in filteredServices"
              :key="service.id"
              class="group relative transition-all duration-300"
              :data-service-id="service.id"
            >
              <div
                class="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <!-- Service Header -->
                <div class="p-4 pb-2">
                  <div class="flex items-center gap-3">
                    <!-- Service Icon -->
                    <div class="relative">
                      <div
                        class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden"
                      >
                        <img
                          v-if="service.icon"
                          :src="service.icon"
                          :alt="service.name"
                          class="w-full h-full object-cover"
                        />
                        <span
                          v-else
                          class="text-sm font-medium text-gray-400"
                          >{{ service.name.charAt(0) }}</span
                        >
                      </div>
                      <!-- App Status Badge -->
                      <div
                        class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900"
                        :class="{
                          'bg-green-500':
                            servicesStore.isServiceInstalled(service),
                          'bg-blue-500':
                            !servicesStore.isServiceInstalled(service),
                        }"
                        :title="
                          servicesStore.isServiceInstalled(service)
                            ? 'Native app installed'
                            : 'Web version available'
                        "
                      ></div>
                    </div>

                    <!-- Service Name -->
                    <div class="flex-1 min-w-0">
                      <h3 class="text-white font-semibold truncate text-base">
                        {{ service.name }}
                      </h3>
                      <p class="text-xs text-gray-400 truncate">
                        {{
                          servicesStore.isServiceInstalled(service)
                            ? "App installed"
                            : "Web access"
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Deep Links -->
                <div v-if="service.deepLinks?.length > 0" class="px-4 pb-4">
                  <div class="space-y-2">
                    <template
                      v-for="(link, index) in service.deepLinks"
                      :key="index"
                    >
                      <button
                        v-if="
                          ('enabled' in link &&
                            link.enabled?.(formattedDetails)) ||
                          !('enabled' in link)
                        "
                        @click.stop="openDeepLink(service, link)"
                        class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-between gap-2 group/link relative overflow-hidden"
                        :class="{
                          'bg-white/5 hover:bg-white/10 text-white': true,
                          'border border-white/5': true,
                          'active:scale-[0.98]': true,
                          'cursor-wait': loadingLinks[getLoadingKey(service, link)]
                        }"
                        :title="link.name"
                        :disabled="loadingLinks[getLoadingKey(service, link)]"
                      >
                        <span
                          class="truncate flex-1 text-left text-gray-200 group-hover/link:text-white transition-colors"
                          :class="{ 'opacity-0': loadingLinks[getLoadingKey(service, link)] }"
                        >
                          {{ link.name }}
                        </span>
                        <div v-if="loadingLinks[getLoadingKey(service, link)]" class="absolute inset-0 flex items-center justify-center">
                          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                        <span
                          class="text-gray-400 group-hover/link:text-white transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </span>
                      </button>
                    </template>
                  </div>
                </div>

                <!-- Accent Border Bottom -->
                <div
                  class="h-0.5 w-full"
                  :style="{ backgroundColor: service.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- No services message -->
        <div
          v-if="servicesStore.selectedServices.length === 0"
          class="text-center py-12"
        >
          <div class="w-16 h-16 mb-4 mx-auto">
            <img
              alt="No services selected"
              class="w-full h-full object-contain opacity-80"
            />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">
            No services selected
          </h3>
          <p class="text-gray-400 mb-6">
            Go back to the introduction to select your movie apps and services.
          </p>
          <button
            @click="goToIntroduction"
            class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Select Services
          </button>
        </div>
      </div>
    </div>

    <!-- Safe Area Bottom -->
    <div class="h-safe-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, CSSProperties } from "vue";
import type { DeepLink, Service } from "@/types";
import type { AppendToResponse, MovieDetails, TvShowDetails } from "tmdb-ts";
import { useRouter } from "vue-router";
import { ArrowLeft, Star, Film } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import { useServicesStore } from "@/stores/services";
import { FormattedDetails } from "@/models/models";
import { MediaType } from "tmdb-ts";

interface Props {
  mediaType: MediaType;
  id?: string; // For backward compatibility
  tmdbId?: string;
  imdbId?: string;
}

const props = defineProps<Props>();

const router = useRouter();
const parallaxBackdrop = ref<HTMLElement | null>(null);
const servicesGrid = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const parallaxOffset = ref(0);

// Handle parallax effect on scroll
const handleScroll = () => {
  if (!parallaxBackdrop.value) return;
  const scrollPosition = window.scrollY || window.pageYOffset;
  parallaxOffset.value = scrollPosition * 0.8; // Adjust the multiplier to control the parallax intensity
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  loadDetails();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const backButtonStyle = {
  "--top-offset": "calc(env(safe-area-inset-top, 0px) + 1rem)",
  top: "var(--top-offset)",
  left: "1rem",
} as CSSProperties;

const moviesStore = useMoviesStore();
const servicesStore = useServicesStore();
const errorMessage = ref<string | null>(null);

const title = computed(() => {
  const details = moviesStore.currentDetails;
  if (!details) return "Loading...";
  return ("title" in details ? details.title : details.name) || "Untitled";
});

const overview = computed(() => moviesStore.currentDetails?.overview || "");

const poster = computed(() => {
  const path = moviesStore.currentDetails?.poster_path;
  return path ? moviesStore.getImageUrl(path, "w500") : null;
});

const backdrop = computed(() => {
  const path = moviesStore.currentDetails?.backdrop_path;
  return path ? moviesStore.getImageUrl(path, "w1280") : null;
});

const releaseYear = computed(() => {
  const details = moviesStore.currentDetails;
  if (!details) return null;

  const date =
    "release_date" in details ? details.release_date : details.first_air_date;
  return date ? new Date(date).getFullYear() : null;
});

const rating = computed(() => moviesStore.currentDetails?.vote_average || 0);

const runtime = computed(() => {
  const details = moviesStore.currentDetails;
  if (!details) return null;

  if ("runtime" in details && details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  return null;
});

const genres = computed(() => moviesStore.currentDetails?.genres || []);

interface ExternalIds {
  imdb_id?: string;
  wikidata_id?: string;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
}

// Filter services based on search query
const filteredServices = computed<Service[]>(() => {
  const query = searchQuery.value.toLowerCase();
  return servicesStore.selectedServices.filter(service => 
    service.name.toLowerCase().includes(query) ||
    (service.description && service.description.toLowerCase().includes(query))
  );
});

// Scroll to a specific service
const scrollToService = (serviceId: string) => {
  if (!servicesGrid.value) return;
  
  const serviceElement = servicesGrid.value.querySelector(`[data-service-id="${serviceId}"]`);
  if (serviceElement) {
    serviceElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center',
    });
    
    // Add highlight effect
    serviceElement.classList.add('highlight-service');
    setTimeout(() => {
      serviceElement.classList.remove('highlight-service');
    }, 1500);
  }
};

const formattedDetails = computed<FormattedDetails | null>(() => {
  const details = moviesStore.currentDetails;
  if (!details) return null;
  
  const title = 'title' in details ? details.title : 'name' in details ? details.name : 'Untitled';
  const releaseDate = 'release_date' in details ? details.release_date : 
                   'first_air_date' in details ? details.first_air_date : '';
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined;
  const rating = 'vote_average' in details ? details.vote_average : undefined;
  const runtime = 'runtime' in details ? 
    `${details.runtime}m` : 
    'episode_run_time' in details && details.episode_run_time?.length ? 
      `${details.episode_run_time[0]}m` : undefined;
  const genres = 'genres' in details ? details.genres : [];
  const overview = 'overview' in details ? details.overview : '';
  
  return {
    title,
    releaseYear,
    rating,
    runtime,
    genres,
    overview,
    tmdbId: details.id.toString(),
    imdbId: details.external_ids.imdb_id,
    wikidataId: details.external_ids.wikidata_id,
    facebookId: details.external_ids.facebook_id,
    instagramId: details.external_ids.instagram_id,
    twitterId: details.external_ids.twitter_id,
    type: props.mediaType
  } satisfies FormattedDetails;
});

const loadingLinks = ref<Record<string, boolean>>({});

const getLoadingKey = (service: Service, link: DeepLink) => {
  return `${service.id}-${link.name}`;
};

const openDeepLink = async (service: Service, link: DeepLink) => {
  const loadingKey = getLoadingKey(service, link);
  
  if (loadingLinks.value[loadingKey]) return;
  
  loadingLinks.value = { ...loadingLinks.value, [loadingKey]: true };
  try {
    const resolvedUrl = await link.url(formattedDetails.value);
    if (!resolvedUrl) return;

    // Handle different types of deep links
    if (resolvedUrl.startsWith("http")) {
      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } else if (service.androidAppId) {
      try {
        const { AppLauncher } = await import("@capacitor/app-launcher");
        await AppLauncher.openUrl({ url: resolvedUrl });
      } catch (error) {
        console.error("Error opening app:", error);
        window.open(service.appUrl, "_blank", "noopener,noreferrer");
      }
    }
  } catch (error) {
    console.error("Error processing deep link:", error);
  } finally {
    loadingLinks.value = { ...loadingLinks.value, [loadingKey]: false };
  }
};

const goBack = () => {
  router.push("/home");
};

const goToIntroduction = () => {
  router.push("/");
};

const loadDetails = async () => {
  try {
    errorMessage.value = null;

    // Prefer tmdbid, fallback to id for backward compatibility
    const tmdbId = props.tmdbId || props.id;

    if (tmdbId) {
      await moviesStore.fetchDetails(parseInt(tmdbId), props.mediaType);
    } else if (props.imdbId) {
      await moviesStore.fetchDetailsByImdbId(props.imdbId, props.mediaType);
    } else {
      throw new Error("No valid ID provided for fetching details");
    }
  } catch (error) {
    console.error("Error loading media details:", error);
    errorMessage.value =
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : "An unknown error occurred while loading details";
  }
};

const retryLoading = async () => {
  await loadDetails();
};

onMounted(() => {
  loadDetails();
});
</script>

<style scoped>
@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.highlight-service {
  animation: highlight 1.5s ease-out;
  border-color: #6366f1 !important;
}

.backdrop {
  position: relative;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
  z-index: 5;
}

/* Smooth transition effect */
.backdrop::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(17, 24, 39, 0.8) 0%,
    rgba(17, 24, 39, 0.6) 50%,
    rgba(17, 24, 39, 0) 100%
  );
  pointer-events: none;
  z-index: 10;
}

/* Gradient transition between sections */
.transition-gradient {
  position: relative;
  z-index: 10;
  height: 80px;
  margin-top: -40px;
  background: linear-gradient(
    to bottom,
    rgba(17, 24, 39, 0) 0%,
    rgba(17, 24, 39, 0.8) 30%,
    rgba(17, 24, 39, 1) 100%
  );
  pointer-events: none;
}
</style>
