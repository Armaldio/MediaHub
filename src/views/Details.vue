<template>
  <div class="ui-page">
    <AppHeader back @back="goBack">
      <RouterLink
        :to="{ name: 'introduction', query: { force: '1' } }"
        class="ui-button ui-button--ghost ui-icon-button"
        aria-label="Manage services"
        title="Manage services"
      >
        <SlidersHorizontal :size="19" aria-hidden="true" />
      </RouterLink>
    </AppHeader>
    <main>
      <div v-if="errorMessage && !detailsLoading" class="ui-container py-10">
        <div class="ui-empty" role="alert">
          <CircleAlert :size="30" class="text-danger" aria-hidden="true" />
          <h1 class="ui-title">Something went wrong</h1>
          <p>{{ errorMessage }}</p>
          <div class="flex flex-wrap justify-center gap-3">
            <button @click="retryLoading" class="ui-button ui-button--primary">
              Try Again
            </button>
            <button @click="goBack" class="ui-button">Go Back</button>
          </div>
        </div>
      </div>
      <div
        v-else-if="detailsLoading"
        class="ui-container py-8"
        role="status"
        aria-label="Loading details"
      >
        <div class="h-64 rounded-panel bg-surface animate-pulse"></div>
        <p class="mt-4 text-muted">Finding your title and service links…</p>
      </div>
      <template v-else-if="moviesStore.currentDetails">
        <section
          class="detail-hero"
          :style="
            backdrop
              ? {
                  backgroundImage: `linear-gradient(90deg, var(--color-canvas), var(--color-scrim)), url(${backdrop})`,
                }
              : undefined
          "
          aria-label="Title information"
        >
          <div class="ui-container detail-intro">
            <div class="detail-poster" :class="{ 'detail-poster--still': episodeNumber !== undefined }">
              <img v-if="poster" :src="poster" :alt="displayTitle" />
              <Film v-else :size="38" :stroke-width="1.3" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-accent mb-3">
                {{ isTv ? "TV show" : "Movie" }}
                <template v-if="seasonNumber !== undefined">
                  · {{ parentShowTitle }}
                </template>
              </p>
              <h1 class="ui-title detail-title">{{ displayTitle }}</h1>
              <div
                class="detail-meta flex flex-wrap items-center gap-3 text-sm text-muted mb-4"
              >
                <span v-if="releaseYear">{{ releaseYear }}</span>
                <span v-if="rating" class="inline-flex items-center gap-1">
                  <Star :size="14" class="text-warning" aria-hidden="true" />
                  {{ rating.toFixed(1) }}
                </span>
                <span v-if="runtime">{{ runtime }}</span>
              </div>
              <div v-if="genres.length" class="flex flex-wrap gap-2 mb-5">
                <span v-for="genre in genres" :key="genre.id" class="ui-badge">
                  {{ genre.name }}
                </span>
              </div>
              <div
                ref="overviewText"
                class="detail-overview"
                :class="{ 'line-clamp-4': !isOverviewExpanded }"
              >
                <p>{{ overview || "No description available." }}</p>
              </div>
              <button
                v-if="showReadMore"
                @click="isOverviewExpanded = !isOverviewExpanded"
                class="ui-link text-xs mt-3"
                :aria-expanded="isOverviewExpanded"
              >
                {{ isOverviewExpanded ? "Show Less" : "Read More" }}
              </button>
              <nav
                v-if="filteredServices.length"
                class="flex flex-wrap gap-2 mt-5"
                aria-label="Jump to a service"
              >
                <button
                  v-for="service in filteredServices"
                  :key="service.id"
                  @click="scrollToService(service.id)"
                  class="ui-chip border-line"
                >
                  <img
                    :src="service.icon"
                    alt=""
                    class="w-5 h-5 rounded object-contain"
                  />
                  {{ service.name }}
                </button>
              </nav>
            </div>
          </div>
        </section>

        <div class="ui-container detail-sections">
          <section v-if="isTv" aria-label="TV show navigation">
            <nav
              v-if="seasonNumber !== undefined"
              class="flex flex-wrap items-center gap-2 text-sm mb-5"
              aria-label="Show hierarchy"
            >
              <button @click="navigateToScope()" class="ui-link">
                {{ parentShowTitle }}
              </button>
              <span class="text-subtle" aria-hidden="true">/</span>
              <button @click="navigateToScope(seasonNumber)" class="ui-link">
                Season {{ seasonNumber }}
              </button>
              <template v-if="episodeNumber !== undefined">
                <span class="text-subtle" aria-hidden="true">/</span>
                <span class="text-muted">Episode {{ episodeNumber }}</span>
              </template>
            </nav>
            <div v-if="seasonNumber === undefined && tvSeasons.length">
              <div class="ui-section-heading">
                <h2 class="ui-section-title">Seasons</h2>
                <span class="ui-badge">{{ tvSeasons.length }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="season in tvSeasons"
                  :key="season.id"
                  @click="navigateToScope(season.season_number)"
                  class="ui-button"
                  :aria-label="`Open season ${season.season_number}: ${season.name}`"
                >
                  Season {{ season.season_number }} · {{ season.name }}
                </button>
              </div>
            </div>
            <div v-if="seasonDetails">
              <div class="ui-section-heading">
                <h2 class="ui-section-title">Episodes</h2>
                <button
                  v-if="episodeNumber !== undefined"
                  @click="navigateToScope(seasonNumber)"
                  class="ui-link text-xs"
                >
                  All episodes
                </button>
              </div>
              <ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="episode in seasonDetails.episodes" :key="episode.id">
                  <button
                    @click="
                      navigateToScope(seasonNumber, episode.episode_number)
                    "
                    class="episode-card ui-panel"
                    :aria-label="`Open season ${seasonNumber} episode ${episode.episode_number}: ${episode.name}`"
                  >
                    <span class="text-xs text-subtle">
                      Episode {{ episode.episode_number }}
                    </span>
                    <span class="font-medium text-ink">{{ episode.name }}</span>
                    <span v-if="episode.air_date" class="text-xs text-muted">
                      {{ episode.air_date }}
                    </span>
                  </button>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="open-with-title">
            <div class="ui-section-heading">
              <div>
                <h2 id="open-with-title" class="ui-section-title">Open with</h2>
                <p class="text-muted text-xs mt-2">
                  {{
                    seasonNumber !== undefined
                      ? "Links open this season or episode when supported; other services open the show."
                      : "Your services. The way you like to watch."
                  }}
                </p>
              </div>
              <span class="ui-badge shrink-0">
                {{ filteredServices.length }} services
              </span>
            </div>
            <div class="detail-filters">
              <label class="ui-search">
                <Search :size="17" aria-hidden="true" />
                <input
                  v-model="searchQuery"
                  type="search"
                  aria-label="Search connected services"
                  placeholder="Find a service…"
                />
              </label>
              <nav class="ui-tabs" aria-label="Service types">
                <button
                  v-for="opt in (['all','mobile','web'] as const)"
                  :key="opt"
                  @click="typeFilter = opt"
                  class="ui-chip"
                  :aria-pressed="typeFilter === opt"
                >
                  {{
                    opt === "mobile"
                      ? "Apps & web"
                      : opt === "all"
                      ? "All services"
                      : "Web only"
                  }}
                </button>
              </nav>
            </div>
            <div ref="servicesGrid" class="detail-service-grid">
              <article
                v-for="service in filteredServices"
                :key="service.id"
                :data-service-id="service.id"
                class="ui-panel detail-service"
              >
                <div class="flex items-center gap-3 mb-4">
                  <img
                    :src="service.icon"
                    alt=""
                    class="w-10 h-10 rounded-control object-contain bg-raised"
                  />
                  <div class="min-w-0">
                    <h3 class="text-sm font-medium text-ink truncate">
                      {{ service.name }}
                    </h3>
                    <p class="text-xs text-muted mt-1">
                      {{
                        servicesStore.isNative &&
                        servicesStore.isServiceInstalled(service)
                          ? "App installed"
                          : service.description
                      }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="isSeerrService(service)"
                  @click="handleSeerrRequest(service)"
                  class="ui-button service-link"
                  :disabled="
                    seerr.isSubmitLoading(service.id) ||
                    seerr.isStatusLoading(service.id)
                  "
                >
                  <LoaderCircle
                    v-if="
                      seerr.isSubmitLoading(service.id) ||
                      seerr.isStatusLoading(service.id)
                    "
                    :size="16"
                    class="animate-spin"
                    aria-hidden="true"
                  />
                  <CircleCheck
                    v-else-if="seerr.getStatus(service.id) === 'available'"
                    :size="16"
                    class="text-success"
                    aria-hidden="true"
                  />
                  <Clock
                    v-else-if="seerr.getStatus(service.id) === 'pending'"
                    :size="16"
                    class="text-warning"
                    aria-hidden="true"
                  />
                  <Plus v-else :size="16" aria-hidden="true" />
                  <span class="flex-1">
                    {{
                      seerr.getStatus(service.id) !== "unknown"
                        ? seerr.getStatusLabel(service.id)
                        : "Request"
                    }}
                  </span>
                  <ArrowUpRight :size="15" aria-hidden="true" />
                </button>
                <div v-else class="space-y-2">
                  <template
                    v-for="(link, index) in service.deepLinks"
                    :key="index"
                  >
                    <button
                      v-if="isLinkVisible(service, link)"
                      @click.stop="openDeepLink(service, link)"
                      class="ui-button service-link"
                      :disabled="loadingLinks[getLoadingKey(service, link)]"
                      :title="link.name"
                    >
                      <LoaderCircle
                        v-if="loadingLinks[getLoadingKey(service, link)]"
                        :size="16"
                        class="animate-spin"
                        aria-hidden="true"
                      />
                      <AppWindow
                        v-else-if="link.requiresApp"
                        :size="16"
                        aria-hidden="true"
                      />
                      <ExternalLink v-else :size="16" aria-hidden="true" />
                      <span class="flex-1 truncate">{{ link.name }}</span>
                      <ArrowUpRight :size="15" aria-hidden="true" />
                    </button>
                  </template>
                </div>
              </article>
            </div>
            <div v-if="!filteredServices.length" class="ui-empty" role="status">
              <Layers :size="28" aria-hidden="true" />
              <h3>No matching services</h3>
              <p>
                {{
                  searchQuery || typeFilter !== "all"
                    ? "Try another name or clear your filters."
                    : "Choose a service with a link available for this title."
                }}
              </p>
              <button
                v-if="searchQuery || typeFilter !== 'all'"
                @click="
                  searchQuery = '';
                  typeFilter = 'all';
                "
                class="ui-button"
              >
                Clear filters
              </button>
              <button
                v-else
                @click="goToIntroduction"
                class="ui-button ui-button--primary"
              >
                Select Services
              </button>
            </div>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
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
import { Star, Film, Search, Layers, ExternalLink, AppWindow, ArrowUpRight, LoaderCircle, CircleCheck, CircleAlert, Clock, Plus, SlidersHorizontal } from "lucide-vue-next";
import AppHeader from "@/components/AppHeader.vue";
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
const overviewText = ref<HTMLElement | null>(null);
const isOverviewExpanded = ref(false);
const showReadMore = ref(false);
const servicesGrid = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const typeFilter = ref<'all' | 'web' | 'mobile'>('all');
const checkOverviewHeight = async () => {
  await nextTick();
  showReadMore.value = (overviewText.value?.scrollHeight ?? 0) > 96;
};
onMounted(checkOverviewHeight);
onUnmounted(() => { moviesStore.cancelPendingDetails(); });

const moviesStore = useMoviesStore();
const servicesStore = useServicesStore();
const seerr = useSeerr();
const errorMessage = ref<string | null>(null);
const detailsLoading = ref(true);

const overview = computed(() => {
  const scope = moviesStore.currentTvScope;
  return scope ? scope.overview || "" : moviesStore.currentDetails?.overview || "";
});

watch(overview, () => {
  isOverviewExpanded.value = false;
  void checkOverviewHeight();
}, { flush: 'post' });

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
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
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

    // Wikidata claims are optional; TVDB and Trakt also use TMDB identifiers.
    const claims = wikidata_id ? await fetchWikidataClaims(wikidata_id) : {};
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
    if (!resolvedUrl) throw new Error("No link available");
    const isWebUrl = /^https?:\/\//i.test(resolvedUrl);
    if (instance && !isWebUrl) throw new Error("Invalid instance link");
    if (!Capacitor.isNativePlatform()) {
      if (isWebUrl) {
        window.open(resolvedUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    const { AppLauncher } = await import("@capacitor/app-launcher");
    const opened = await AppLauncher.openUrl({ url: resolvedUrl }).catch(() => ({ completed: false }));
    if (opened.completed) return;

    if (service.appUrl && service.appUrl !== resolvedUrl) {
      const fallback = await AppLauncher.openUrl({ url: service.appUrl });
      if (fallback.completed) return;
    }
    throw new Error("No app could open the link");
  } catch (error) {
    console.error("Error opening service link:", error);
    alert(`Could not open ${service.name}. Please try again.`);
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
.detail-hero {
  background-position: center;
  background-size: cover;
  border-bottom: 1px solid var(--color-line-soft);
}
.detail-intro {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  align-items: start;
  gap: 32px;
  padding-block: 32px;
}
.detail-poster {
  display: grid;
  place-items: center;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  color: var(--color-subtle);
}
.detail-poster--still { aspect-ratio: 16 / 9; }
.detail-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail-title {
  font-size: clamp(28px, 4vw, 40px);
}
.detail-overview {
  color: var(--color-muted);
  font-size: 14px;
  line-height: 24px;
  max-width: 720px;
}
.detail-sections {
  display: grid;
  gap: 32px;
  padding-block: 28px;
}
.detail-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}
.detail-filters .ui-search {
  width: 100%;
  max-width: 430px;
}
.detail-service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.detail-service {
  padding: 18px;
  scroll-margin-top: 20px;
}
.service-link {
  width: 100%;
  text-align: left;
  color: var(--color-muted);
  background: var(--color-raised);
  border-color: transparent;
}
.service-link:hover:not(:disabled) {
  color: var(--color-accent);
  border-color: var(--color-accent-line);
}
.episode-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 16px;
  text-align: left;
  cursor: pointer;
}
.episode-card:hover {
  border-color: var(--color-accent);
}
.highlight-service {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
@media (max-width: 900px) {
  .detail-service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 580px) {
  .detail-intro {
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 18px;
    padding-block: 24px;
  }
  .detail-intro > div:last-child {
    display: contents;
  }
  .detail-intro > div:last-child > p,
  .detail-intro h1 {
    grid-column: 2;
  }
  .detail-poster {
    grid-row: 1 / 4;
  }
  .detail-intro > div:last-child > div,
  .detail-intro nav,
  .detail-intro > div:last-child > button {
    grid-column: 1 / -1;
  }
  .detail-intro > div:last-child > .detail-meta {
    grid-column: 2;
  }
  .detail-intro {
    row-gap: 12px;
  }
  .detail-service-grid {
    grid-template-columns: 1fr;
  }
  .detail-title {
    font-size: 28px;
    overflow-wrap: anywhere;
  }
  .detail-overview {
    font-size: 13px;
  }
}
</style>
