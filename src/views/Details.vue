<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Safe Area Top -->
    <div class="h-safe-top"></div>

    <!-- Error State -->
    <div
      v-if="errorMessage && !detailsLoading"
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
    <div v-if="moviesStore.currentDetails || detailsLoading" class="relative">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="fixed z-50 p-3 glass-effect rounded-full text-white hover:bg-white/20 transition-all"
        :style="backButtonStyle"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>

      <!-- Hero Section with Parallax -->
      <div class="relative backdrop overflow-hidden">
        <!-- Parallax Backdrop -->
        <div
          v-if="backdrop"
          ref="parallaxBackdrop"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 w-screen"
          :style="{
            backgroundImage: `url(${backdrop})`,
          }"
        >
          <div class="absolute inset-0 bg-gray-900/90"></div>
        </div>

        <!-- Content -->
        <div class="relative h-full flex items-top">
          <div class="max-w-7xl mx-auto px-4 w-full">
            <div class="flex flex-col lg:flex-row items-start gap-8 py-8">
              <!-- Poster -->
              <div class="flex-shrink-0 mt-12 lg:mt-0 lg:pt-12">
                <div class="relative group">
                  <img
                    v-if="poster"
                    :src="poster"
                    :alt="displayTitle"
                    class="h-48 object-cover rounded-xl shadow-2xl transform transition-transform duration-300 group-hover:scale-102"
                  />
                  <div
                    v-else
                    class="h-48 bg-gray-800 rounded-xl flex items-center justify-center"
                  >
                    <Film class="h-16 w-16 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 text-white">
              <div>
                <h1 class="text-4xl md:text-6xl font-bold mb-4">
                  {{ displayTitle }}
                </h1>

                <!-- Meta Info -->
                <div
                  class="flex flex-wrap items-center gap-4 mb-6 text-gray-300"
                >
                  <span v-if="releaseYear" class="text-lg">{{
                    releaseYear
                  }}</span>
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
                    class="px-3 py-1 bg-white/20 rounded-full text-sm"
                  >
                    {{ genre.name }}
                  </span>
                </div>

                <!-- Overview and Quick Access Container -->
                <div class="space-y-4">
                  <!-- Overview -->
                  <div class="relative">
                    <div
                      ref="overviewText"
                      class="text-gray-300 leading-relaxed transition-all duration-500 ease-in-out overflow-hidden"
                      :style="{
                        maxHeight: isOverviewExpanded
                          ? `${overviewHeight}px`
                          : '6rem',
                        willChange: 'max-height, opacity',
                        opacity: isOverviewExpanded ? 1 : 0.98,
                      }"
                      @transitionend="onTransitionEnd"
                    >
                      <p v-if="overview || moviesStore.currentTvScope" class="mb-8">
                        {{ overview || "No description available." }}
                      </p>
                    </div>

                    <!-- Read More Button -->
                    <div
                      v-if="showReadMore"
                      class="relative z-10 mt-2 flex justify-start"
                    >
                      <button
                        @click="toggleOverview"
                        class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-all duration-200 flex items-top gap-1 group bg-gray-900/80 px-3 py-1.5 rounded-lg"
                      >
                        {{ isOverviewExpanded ? "Show Less" : "Read More" }}
                        <svg
                          class="w-4 h-4 transition-transform duration-300"
                          :class="{
                            'transform rotate-180': isOverviewExpanded,
                          }"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Quick Access Icons - After Description -->
                  <div class="pt-2 pb-24">
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="service in filteredServices"
                        :key="`quick-${service.id}`"
                        @click="scrollToService(service.id)"
                        class="p-2.5 bg-gray-800/60 hover:bg-gray-700/80 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-black/20 flex items-center gap-2 group"
                        :title="service.name"
                      >
                        <div
                          class="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                        >
                          <div
                            class="absolute inset-0 bg-gray-800/80 group-hover:bg-gray-700/80 transition-colors"
                          ></div>
                          <img
                            v-if="service.icon"
                            :src="service.icon"
                            :alt="service.name"
                            class="relative z-10 w-5 h-5 object-contain"
                          />
                          <span
                            v-else
                            class="relative z-10 text-xs text-white font-medium"
                            >{{ service.name.charAt(0) }}</span
                          >
                        </div>
                        <span class="text-sm text-gray-200 pr-1">{{
                          service.name
                        }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gradient transition -->
          <div
            class="relative z-10 h-24 -mt-24 bg-gray-900 pointer-events-none"
          ></div>

      <section v-if="isTv" class="max-w-7xl mx-auto px-4 pt-6" aria-label="TV show navigation">
        <nav class="flex flex-wrap items-center gap-2 text-sm text-indigo-300 mb-4" aria-label="Show hierarchy">
          <button v-if="seasonNumber !== undefined" @click="navigateToScope()" class="hover:text-white">{{ parentShowTitle }}</button>
          <span v-if="seasonNumber !== undefined" aria-hidden="true">›</span>
          <button v-if="seasonNumber !== undefined" @click="navigateToScope(seasonNumber)" class="hover:text-white">Season {{ seasonNumber }}</button>
          <template v-if="episodeNumber !== undefined"><span aria-hidden="true">›</span><span class="text-gray-300">Episode {{ episodeNumber }}</span></template>
        </nav>
        <div v-if="seasonNumber === undefined && tvSeasons.length" class="mb-8">
          <h2 class="text-xl font-semibold text-white mb-3">Seasons</h2>
          <div class="flex flex-wrap gap-2">
            <button v-for="season in tvSeasons" :key="season.id" @click="navigateToScope(season.season_number)" class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-left text-white hover:border-indigo-400" :aria-label="`Open season ${season.season_number}: ${season.name}`">
              Season {{ season.season_number }} · {{ season.name }}
            </button>
          </div>
        </div>
        <div v-if="seasonDetails" class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold text-white">Episodes</h2>
            <button v-if="episodeNumber !== undefined" @click="navigateToScope(seasonNumber)" class="text-sm text-indigo-300 hover:text-white">All episodes</button>
          </div>
          <ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="episode in seasonDetails.episodes" :key="episode.id">
              <button @click="navigateToScope(seasonNumber, episode.episode_number)" class="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-left text-white hover:border-indigo-400" :aria-label="`Open season ${seasonNumber} episode ${episode.episode_number}: ${episode.name}`">
                <span class="block text-xs text-gray-400">Episode {{ episode.episode_number }}</span>
                <span class="block font-medium">{{ episode.name }}</span>
                <span v-if="episode.air_date" class="block text-xs text-gray-400 mt-1">{{ episode.air_date }}</span>
              </button>
            </li>
          </ol>
        </div>
      </section>

      <!-- Services Section -->
      <div class="relative z-20 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-white mb-1">Open with</h2>
              <p class="text-gray-400 text-sm">{{ seasonNumber !== undefined ? 'Links open this season or episode when supported; other services open the show.' : 'Your connected services' }}</p>
            </div>
            <div
              class="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
            >
              {{ servicesStore.selectedServices.length }} services
            </div>
          </div>

          <!-- Search + Type Filter -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search services..."
              />
            </div>
            <div class="inline-flex self-start rounded-full bg-gray-800 p-1 border border-gray-700">
              <button
                v-for="opt in (['all','mobile','web'] as const)"
                :key="opt"
                @click="typeFilter = opt"
                class="px-4 py-1.5 text-sm rounded-full transition-colors"
                :class="typeFilter === opt ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'"
              >
                {{ opt === 'mobile' ? 'Apps' : opt === 'all' ? 'All' : 'Web' }}
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
                            !!service.androidAppId && servicesStore.isServiceInstalled(service),
                          'bg-blue-500':
                            !service.androidAppId || !servicesStore.isServiceInstalled(service),
                        }"
                        :title="
                          service.androidAppId && servicesStore.isServiceInstalled(service)
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
                          service.androidAppId && servicesStore.isServiceInstalled(service)
                            ? "App installed"
                            : "Web access"
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                    <!-- Deep Links -->
                    <div v-if="service.deepLinks?.length > 0 || isSeerrService(service)" class="px-4 pb-4">
                      <!-- Seerr: API-powered request button -->
                      <div v-if="isSeerrService(service)">
                        <button
                          @click="handleSeerrRequest(service)"
                          class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-between gap-2 group/link relative overflow-hidden bg-white/5 hover:bg-white/10 text-white border border-white/5 active:scale-[0.98] disabled:cursor-wait"
                          :disabled="seerr.isSubmitLoading(service.id) || seerr.isStatusLoading(service.id)"
                        >
                          <span class="flex items-center gap-2">
                            <div
                              v-if="seerr.isStatusLoading(service.id) || seerr.isSubmitLoading(service.id)"
                              class="w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center"
                            >
                              <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            </div>
                            <div
                              v-else-if="seerr.getStatus(service.id) !== 'unknown'"
                              class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                              :style="{ borderColor: seerr.getStatusColor(service.id), backgroundColor: seerr.getStatusColor(service.id) + '20' }"
                            >
                              <svg
                                v-if="seerr.getStatus(service.id) === 'available'"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3"
                                :style="{ color: seerr.getStatusColor(service.id) }"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                              <div
                                v-else-if="seerr.getStatus(service.id) === 'pending'"
                                class="w-3 h-3 rounded-full"
                                :style="{ backgroundColor: seerr.getStatusColor(service.id) }"
                              ></div>
                            </div>
                            <div
                              v-else
                              class="w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center"
                            >
                              <MovieIcon class="w-3 h-3 text-gray-300" />
                            </div>
                            <span class="text-gray-200 group-hover/link:text-white">
                              {{ seerr.getStatus(service.id) !== 'unknown' ? seerr.getStatusLabel(service.id) : 'Request' }}
                            </span>
                          </span>
                          <span
                            v-if="seerr.getStatus(service.id) === 'unknown' && !seerr.isSubmitLoading(service.id)"
                            class="text-gray-400 group-hover/link:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </span>
                        </button>
                      </div>

                      <!-- Generic deep links -->
                      <div v-else class="space-y-2">
                        <template
                      v-for="(link, index) in service.deepLinks"
                      :key="index"
                    >
                      <button
                        v-if="isLinkVisible(service, link)"
                        @click.stop="openDeepLink(service, link)"
                        class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-between gap-2 group/link relative overflow-hidden"
                        :class="{
                          'bg-white/5 hover:bg-white/10 text-white': true,
                          'border border-white/5': true,
                          'active:scale-[0.98]': true,
                          'cursor-wait':
                            loadingLinks[getLoadingKey(service, link)],
                        }"
                        :title="link.name"
                        :disabled="loadingLinks[getLoadingKey(service, link)]"
                      >
                        <span
                          v-if="link.mediaType"
                          class="flex items-center justify-center space-x-0.5"
                        >
                          <div
                            v-if="link.mediaType === 'all'"
                            class="flex items-center justify-center space-x-0.5"
                          >
                            <div
                              class="w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center"
                            >
                              <MovieIcon class="w-3 h-3 text-gray-300" />
                            </div>
                            <div
                              class="w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center"
                            >
                              <Tv class="w-3 h-3 text-gray-300" />
                            </div>
                          </div>
                          <div
                            v-else
                            class="w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center"
                          >
                            <component
                              :is="link.mediaType === 'tv' ? Tv : MovieIcon"
                              class="w-3 h-3 text-gray-300"
                            />
                          </div>
                        </span>
                        <span
                          class="truncate flex-1 text-left text-gray-200 group-hover/link:text-white transition-colors"
                          :class="{
                            'opacity-0':
                              loadingLinks[getLoadingKey(service, link)],
                          }"
                        >
                          {{ link.name }}
                        </span>
                        <div
                          v-if="loadingLinks[getLoadingKey(service, link)]"
                          class="absolute inset-0 flex items-center justify-center"
                        >
                          <div
                            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                          ></div>
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
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  CSSProperties,
  nextTick,
  watch,
} from "vue";
import type { DeepLink, Service, CustomServiceInstance } from "@/types";

interface InstanceService extends Service {
  isInstance: true;
  instanceId: string;
  parentServiceId: string;
  instanceData: CustomServiceInstance;
}

import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { ArrowLeft, Star, Film, Tv, Film as MovieIcon } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import { useServicesStore } from "@/stores/services";
import { FormattedDetails } from "@/models/models";
import { MediaType } from "tmdb-ts";
import { fetchTVDBData } from "@/data/services";
import { extractWikidataProviderIds } from "@/utils/wikidataProviderIds";
import { getTraktSlug } from "@/utils/traktLookup";
import { useSeerr } from "@/composables/useSeerr";

interface Props {
  mediaType: MediaType;
  id?: string; // For backward compatibility
  tmdbId?: string;
  imdbId?: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();
const parallaxBackdrop = ref<HTMLElement | null>(null);
const overviewText = ref<HTMLElement | null>(null);
const overviewHeight = ref(0);
const isOverviewExpanded = ref(false);
const showReadMore = ref(false);
const isAnimating = ref(false);

// Check if overview text needs a "Read More" button
const checkOverviewHeight = async () => {
  await nextTick();
  if (overviewText.value) {
    // Store the full height for smooth animation
    overviewHeight.value = overviewText.value.scrollHeight;
    showReadMore.value = overviewText.value.scrollHeight > 96; // 6rem = 96px (4 lines of text)
  }
};

const toggleOverview = () => {
  if (isAnimating.value) return;
  isOverviewExpanded.value = !isOverviewExpanded.value;
  isAnimating.value = true;
};

const onTransitionEnd = () => {
  isAnimating.value = false;
};
const servicesGrid = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const typeFilter = ref<'all' | 'web' | 'mobile'>('all');
const parallaxOffset = ref(0);

// Handle parallax effect on scroll
const handleScroll = () => {
  if (!parallaxBackdrop.value) return;
  const scrollPosition = window.scrollY || window.pageYOffset;
  parallaxOffset.value = scrollPosition * 0.8; // Adjust the multiplier to control the parallax intensity
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await nextTick();
  checkOverviewHeight();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  moviesStore.cancelPendingDetails();
});

const backButtonStyle = {
  "--top-offset": "calc(env(safe-area-inset-top, 0px) + 1rem)",
  top: "var(--top-offset)",
  left: "1rem",
} as CSSProperties;

const moviesStore = useMoviesStore();
const servicesStore = useServicesStore();
const seerr = useSeerr();
const errorMessage = ref<string | null>(null);
const detailsLoading = ref(true);

const overview = computed(() => {
  const scope = moviesStore.currentTvScope;
  return scope ? scope.overview || "" : moviesStore.currentDetails?.overview || "";
});

const isTv = computed(() => props.mediaType === "tv");
const seasonNumber = computed(() => {
  const value = route.query.season;
  if (value === undefined) return moviesStore.currentTvScope?.season_number ?? moviesStore.currentTvSeason?.season_number;
  const stringValue = Array.isArray(value) ? value[0] : value;
  return typeof stringValue === "string" && /^\d+$/.test(stringValue) ? Number(stringValue) : undefined;
});
const episodeNumber = computed(() => {
  const value = route.query.episode;
  if (value === undefined) {
    const scope = moviesStore.currentTvScope;
    return scope && "episode_number" in scope ? scope.episode_number : undefined;
  }
  const stringValue = Array.isArray(value) ? value[0] : value;
  return typeof stringValue === "string" && /^\d+$/.test(stringValue) ? Number(stringValue) : undefined;
});
const seasonDetails = computed(() => {
  const scope = moviesStore.currentTvSeason ?? moviesStore.currentTvScope;
  return scope && "episodes" in scope ? scope : null;
});
const tvSeasons = computed(() => {
  const details = moviesStore.currentDetails;
  return details && "seasons" in details ? details.seasons : [];
});
const parentShowTitle = computed(() => {
  const details = moviesStore.currentDetails;
  return details && "name" in details ? details.name : "Show";
});
const displayTitle = computed(() => {
  const scope = moviesStore.currentTvScope;
  return scope && "episode_number" in scope
    ? `S${String(scope.season_number).padStart(2, "0")}E${String(scope.episode_number).padStart(2, "0")} · ${scope.name}`
    : scope?.name ?? formattedDetails.value?.title ?? "Untitled";
});

const poster = computed(() => {
  const scope = moviesStore.currentTvScope;
  const path = scope && "episode_number" in scope
    ? scope.still_path
    : scope?.poster_path ?? moviesStore.currentDetails?.poster_path;
  return path ? moviesStore.getImageUrl(path, "w500") : null;
});

const backdrop = computed(() => {
  const path = moviesStore.currentDetails?.backdrop_path;
  return path ? moviesStore.getImageUrl(path, "w1280") : null;
});

const releaseYear = computed(() => {
  const scope = moviesStore.currentTvScope;
  if (scope) {
    const scopedDate = scope.air_date;
    return scopedDate ? new Date(scopedDate).getFullYear() : null;
  }
  const details = moviesStore.currentDetails;
  if (!details) return null;

  const date =
    "release_date" in details ? details.release_date : details.first_air_date;
  return date ? new Date(date).getFullYear() : null;
});

const rating = computed(() => {
  const scope = moviesStore.currentTvScope;
  if (scope) return "vote_average" in scope ? scope.vote_average || 0 : 0;
  return moviesStore.currentDetails?.vote_average || 0;
});

const runtime = computed(() => {
  const scopedRuntime = moviesStore.currentTvScope && "runtime" in moviesStore.currentTvScope
    ? moviesStore.currentTvScope.runtime
    : undefined;
  if (scopedRuntime) {
    const hours = Math.floor(scopedRuntime / 60);
    const minutes = scopedRuntime % 60;
    return `${hours}h ${minutes}m`;
  }
  const details = moviesStore.currentDetails;
  if (!details) return null;

  if ("runtime" in details && details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  return null;
});

const navigateToScope = (season?: number, episode?: number) => {
  const resolvedTmdbId = moviesStore.currentDetails?.id;
  const tmdbId = resolvedTmdbId?.toString() || props.tmdbId || props.id;
  const imdbId = props.imdbId;
  const idType = tmdbId ? "tmdb" : "imdb";
  const id = tmdbId || imdbId;
  if (!id) return;
  const query: Record<string, string> = { source: idType };
  if (season !== undefined) query.season = String(season);
  if (episode !== undefined) query.episode = String(episode);
  void router.push({
    name: `details-${idType}`,
    params: { mediaType: "tv", [`${idType}Id`]: id },
    query,
  });
};

const genres = computed(() => moviesStore.currentDetails?.genres || []);

const isSeerrService = (service: Service) =>
  service.id === "seerr" || (isInstance(service) && service.parentServiceId === "seerr");

const fetchSeerrStatuses = (details: FormattedDetails) => {
  servicesStore.selectedServices
    .filter((service): service is InstanceService => isInstance(service) && service.parentServiceId === "seerr")
    .filter((service) => !!service.instanceData.apiKey)
    .forEach((service) => seerr.fetchStatus(service.id, service.instanceData, details));
};

// Filter services based on search query and ensure at least one deep link is enabled
// Check if a deep link should be visible for a service
const isInstance = (service: Service): service is InstanceService =>
  'instanceData' in service;

const isLinkVisible = (service: Service, link: DeepLink) => {
  const details = formattedDetails.value;
  if (!details) return false;

  // For a self-hosted instance, app-only (requiresApp) links can't target the
  // instance, so only show instance-aware links
  if (isInstance(service) && link.requiresApp) return false;

  if (link.requiresApp && (!servicesStore.isNative || !servicesStore.isServiceInstalled(service))) {
    return false;
  }
  return ('enabled' in link && link.enabled?.(details)) || !('enabled' in link);
};

const filteredServices = computed<Service[]>(() => {
  const query = searchQuery.value.toLowerCase();
  return servicesStore.selectedServices
    .filter((service) => !(service.supportsCustomInstances && !('isInstance' in service)))
    .filter((service) => {
      if (typeFilter.value === 'web' && service.androidAppId) return false;
      if (typeFilter.value === 'mobile' && !service.androidAppId) return false;
      return true;
    })
    .filter((service) => {
      // Check if at least one deep link is enabled and available
      const hasEnabledLink = isSeerrService(service) || (service.deepLinks?.some((link) =>
        isLinkVisible(service, link)
      ) ?? false);

      // Check search match
      const matchesSearch = service.name.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query));

      return hasEnabledLink && matchesSearch;
    });
});

// Scroll to a specific service
const scrollToService = (serviceId: string) => {
  if (!servicesGrid.value) return;

  const serviceElement = servicesGrid.value.querySelector(
    `[data-service-id="${serviceId}"]`
  );
  if (serviceElement) {
    serviceElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Add highlight effect
    serviceElement.classList.add("highlight-service");
    setTimeout(() => {
      serviceElement.classList.remove("highlight-service");
    }, 1500);
  }
};

const formattedDetails = ref<FormattedDetails | null>(null);
let enrichmentRequestId = 0;

const fetchWikidataClaims = async (wikidataId: string) => {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&props=claims&format=json&origin=*`;
    const response = await fetch(url);
    const data = await response.json();
    return data?.entities?.[wikidataId]?.claims ?? {};
  } catch (error) {
    console.error("Error fetching provider IDs from Wikidata:", error);
    return {};
  }
};

watch(
  () => [moviesStore.currentDetails, moviesStore.currentTvScope] as const,
  async ([newDetails, scopedDetails]) => {
    const requestId = ++enrichmentRequestId;
    if (!newDetails) {
      formattedDetails.value = null;
      return;
    }

    const details = newDetails;
    const externalIds = details.external_ids;
    const { wikidata_id } = externalIds;

    const title =
      "title" in details
        ? details.title
        : "name" in details
        ? details.name
        : "Untitled";
    const releaseDate =
      "release_date" in details
        ? details.release_date
        : "first_air_date" in details
        ? details.first_air_date
        : "";
    const releaseYear = releaseDate
      ? new Date(releaseDate).getFullYear().toString()
      : undefined;
    const rating = "vote_average" in details ? details.vote_average : undefined;
    const runtime =
      "runtime" in details
        ? `${details.runtime}m`
        : "episode_run_time" in details && details.episode_run_time?.length
        ? `${details.episode_run_time[0]}m`
        : undefined;
    const genres = "genres" in details ? details.genres : [];
    const overview = "overview" in details ? details.overview : "";

    // Assign base details immediately so the page renders without
    // waiting for the Wikidata/TVDB enrichment requests
    formattedDetails.value = {
      title,
      releaseYear,
      rating,
      runtime,
      genres,
      overview,
      tmdbId: details.id.toString(),
      imdbId: details.external_ids.imdb_id,
      tvdbId: externalIds.tvdb_id?.toString(),
      wikidataId: details.external_ids.wikidata_id,
      facebookId: details.external_ids.facebook_id,
      instagramId: details.external_ids.instagram_id,
      twitterId: details.external_ids.twitter_id,
      type: props.mediaType,
      seasonNumber: scopedDetails?.season_number,
      episodeNumber: scopedDetails && "episode_number" in scopedDetails ? scopedDetails.episode_number : undefined,
      seasonTmdbId: scopedDetails && "episodes" in scopedDetails ? String(scopedDetails.id) : undefined,
      episodeTmdbId: scopedDetails && "episode_number" in scopedDetails ? String(scopedDetails.id) : undefined,
      episodeImdbId: scopedDetails && "episode_number" in scopedDetails ? scopedDetails.external_ids?.imdb_id : undefined,
    };

    fetchSeerrStatuses(formattedDetails.value);

    if (!wikidata_id) {
      console.log("No Wikidata ID available");
      return;
    }

    // Fetch all external IDs from Wikidata in parallel
    const claims = await fetchWikidataClaims(wikidata_id);
    if (requestId !== enrichmentRequestId) return;
    const claimValue = (property: string) => {
      const value = claims[property]?.[0]?.mainsnak?.datavalue?.value;
      return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
    };
    const providerIds = extractWikidataProviderIds(claims, props.mediaType);
    const tvdbProperty = props.mediaType === "movie" ? "P12196" : "P4835";
    const tvdbClaim = externalIds.tvdb_id ? undefined : claimValue(tvdbProperty);

    const tvdbId =
      externalIds.tvdb_id?.toString() ||
      (tvdbClaim ? tvdbClaim.toString() : undefined);

    // Update with the resolved external IDs
    formattedDetails.value = {
      ...formattedDetails.value,
      tvdbId,
      ...providerIds,
      netflixId: claimValue("P1874"),
      amazonPrimeId: claimValue("P8055"),
      disneyPlusId: claimValue(props.mediaType === "movie" ? "P7595" : "P7596"),
      hboMaxId: claimValue("P8298"),
      appleTvId: claimValue(props.mediaType === "movie" ? "P9586" : "P9751"),
      paramountPlusId: claimValue("P13147"),
      letterboxdId: claimValue("P6127"),
      mubiId: claimValue("P7299"),
    };
    const enrichedDetails = formattedDetails.value;
    if (!enrichedDetails) return;

    // Look up the Trakt slug from TMDB ID (async, parallel with TVDB fetch)
    const traktSlug = getTraktSlug(enrichedDetails);

    // Fetch TVDB data and enhance the formatted details
    const tvdbDetails = await fetchTVDBData(enrichedDetails);
    if (requestId !== enrichmentRequestId) return;
    formattedDetails.value = tvdbDetails;

    const slug = await traktSlug;
    if (requestId !== enrichmentRequestId) return;
    if (slug) {
      formattedDetails.value = {
        ...formattedDetails.value,
        traktSlug: slug,
      };
    }

  },
  { immediate: true }
);

const loadingLinks = ref<Record<string, boolean>>({});

const getLoadingKey = (service: Service, link: DeepLink) => {
  return `${service.id}-${link.name}`;
};

const openDeepLink = async (service: Service, link: DeepLink) => {
  const loadingKey = getLoadingKey(service, link);

  if (loadingLinks.value[loadingKey]) return;

  loadingLinks.value = { ...loadingLinks.value, [loadingKey]: true };
  try {
    const instance = isInstance(service) ? service.instanceData : undefined;
    const details = formattedDetails.value!;
    // Prefer customUrlBuilder (instance-aware web URL) when available,
    // otherwise fall back to the link's url resolver (with the instance)
    const resolvedUrl = link.customUrlBuilder
      ? await link.customUrlBuilder(details, instance!)
      : await link.url(details, instance);
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

const handleSeerrRequest = async (service: Service) => {
  if (!isInstance(service)) return;
  const instance = service.instanceData;
  const details = formattedDetails.value;
  if (!details) return;

  const mediaUrl = `${instance.baseUrl.replace(/\/$/, "")}/${details.type === "movie" ? "movie" : "tv"}/${details.tmdbId}`;
  if (!instance.apiKey) {
    window.open(mediaUrl, "_blank", "noopener,noreferrer");
    return;
  }

  if (seerr.getStatus(service.id) === "unknown") {
    await seerr.submitRequest(service.id, instance, details);
    return;
  }
  // Already requested: open the web UI
  window.open(mediaUrl, "_blank", "noopener,noreferrer");
};

const loadDetails = async () => {
  const requestId = ++loadRequestId;
  try {
    errorMessage.value = null;
    detailsLoading.value = true;
    moviesStore.cancelPendingDetails();
    seerr.reset();

    // Clear any previously loaded media so navigating from another
    // detail page never shows stale content while this one loads
    moviesStore.currentDetails = null;
    moviesStore.currentTvScope = null;
    moviesStore.currentTvSeason = null;
    formattedDetails.value = null;

    // Prefer tmdbid, fallback to id for backward compatibility
    const tmdbId = props.tmdbId || props.id;
    const readScopeNumber = (key: "season" | "episode", minimum: number) => {
      const value = route.query[key];
      if (value === undefined) return undefined;
      const text = Array.isArray(value) ? value[0] : value;
      if (typeof text !== "string" || !/^\d+$/.test(text) || Number(text) < minimum) {
        throw new Error(key === "season" ? "Season must be a non-negative number" : "Episode must be a positive number");
      }
      return Number(text);
    };
    const scope = isTv.value ? {
      seasonNumber: readScopeNumber("season", 0),
      episodeNumber: readScopeNumber("episode", 1),
    } : {};
    if (scope.episodeNumber !== undefined && scope.seasonNumber === undefined) {
      throw new Error("An episode requires a season number");
    }

    if (tmdbId) {
      if (isTv.value) {
        await moviesStore.fetchTvDetails(parseInt(tmdbId, 10), scope);
      } else {
        await moviesStore.fetchDetails(parseInt(tmdbId, 10), props.mediaType);
      }
    } else if (props.imdbId) {
      await moviesStore.fetchDetailsByImdbId(props.imdbId, props.mediaType, scope);
    } else {
      throw new Error("No valid ID provided for fetching details");
    }
  } catch (error) {
    if (requestId !== loadRequestId) return;
    console.error("Error loading media details:", error);
    errorMessage.value =
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : "An unknown error occurred while loading details";
  } finally {
    if (requestId === loadRequestId) detailsLoading.value = false;
  }
};

let loadRequestId = 0;
watch(
  () => [props.mediaType, props.tmdbId, props.imdbId, props.id, route.query.season, route.query.episode],
  () => { void loadDetails(); },
  { immediate: true }
);

const retryLoading = async () => {
  await loadDetails();
};
</script>

<style scoped>
@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
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
  background: rgba(17, 24, 39, 0.8);
  pointer-events: none;
  z-index: 10;
}

.transition-gradient {
  position: relative;
  z-index: 10;
  height: 80px;
  margin-top: -40px;
  background: rgba(17, 24, 39, 1);
  pointer-events: none;
}
</style>
