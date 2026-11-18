<template>
  <div class="service-picker" :class="{ 'selection-open': showSelection }">
    <AppHeader>
      <span class="header-note">A shortcut to what you love</span>
    </AppHeader>
    <div class="picker-shell ui-container">
      <main>
        <div class="picker-intro ui-page-intro">
          <h1 class="ui-title">Your services. One place.</h1>
          <p class="ui-description">
            Pick where you watch, track, and discover. We'll bring the links
            together.
          </p>
        </div>

        <div class="picker-toolbar">
          <label class="service-search ui-search">
            <Search :size="18" aria-hidden="true" />
            <input
              v-model="serviceQuery"
              type="search"
              placeholder="Find a service…"
              aria-label="Search services"
            />
          </label>
          <label v-if="servicesStore.isNative" class="installed-filter">
            <input v-model="showInstalledOnly" type="checkbox" />
            Installed apps only
          </label>
          <span v-else class="catalog-count">
            {{ catalog.length }} services, one collection
          </span>
        </div>

        <nav class="category-filters ui-tabs" aria-label="Service categories">
          <button
            class="ui-chip"
            v-for="category in categories"
            :key="category.id"
            type="button"
            :aria-pressed="categoryFilter === category.id"
            @click="categoryFilter = category.id"
          >
            {{ category.label }}
          </button>
        </nav>

        <div v-if="visibleGroups.length" class="service-groups">
          <section
            v-for="group in visibleGroups"
            :key="group.id"
            :aria-labelledby="`group-${group.id}`"
          >
            <div class="group-heading">
              <h2 :id="`group-${group.id}`">{{ group.title }}</h2>
              <span>{{ group.services.length }}</span>
            </div>
            <div class="service-grid">
              <label
                v-for="service in group.services"
                :key="service.id"
                class="picker-card"
                :class="{
                  'is-selected': servicesStore.isServiceSelected(service.id),
                }"
              >
                <input
                  type="checkbox"
                  :aria-label="service.name"
                  :checked="servicesStore.isServiceSelected(service.id)"
                  :disabled="
                    atServiceLimit &&
                    !servicesStore.isServiceSelected(service.id)
                  "
                  @change="toggleService(service.id)"
                />
                <span class="service-icon">
                  <img
                    v-if="service.icon"
                    :src="service.icon"
                    alt=""
                    loading="lazy"
                  />
                  <span v-else>{{ service.name.charAt(0) }}</span>
                </span>
                <span class="service-copy">
                  <span class="service-name">{{ service.name }}</span>
                  <span class="service-description">
                    {{ service.description }}
                  </span>
                  <span
                    v-if="
                      servicesStore.isNative &&
                      servicesStore.isServiceInstalled(service)
                    "
                    class="installed-status"
                  >
                    Installed
                  </span>
                </span>
                <span class="selection-check" aria-hidden="true">
                  <Check
                    v-if="servicesStore.isServiceSelected(service.id)"
                    :size="13"
                    :stroke-width="3"
                  />
                </span>
              </label>
            </div>
          </section>
        </div>
        <div v-else class="empty-services">
          <Search :size="28" :stroke-width="1.5" aria-hidden="true" />
          <h2>No services found</h2>
          <p>Try another name or adjust your filters.</p>
          <button type="button" @click="resetFilters">Clear filters</button>
        </div>
        <p class="picker-footnote">
          You can change your selection and its order anytime.
        </p>
      </main>
    </div>

    <footer class="selection-footer">
      <div
        v-if="showSelection && selectedServices.length"
        id="selected-services"
        class="selection-panel"
      >
        <div class="selection-panel-heading">
          <div>
            <h2>Your lineup</h2>
            <p>Drag to reorder, or use the arrow buttons.</p>
          </div>
          <button
            type="button"
            class="icon-button ui-button ui-button--ghost ui-icon-button"
            aria-label="Close selected services"
            @click="showSelection = false"
          >
            <X :size="18" />
          </button>
        </div>
        <draggable
          v-model="selectedServices"
          item-key="id"
          handle=".drag-handle"
          :animation="150"
          ghost-class="selection-ghost"
          class="selected-list"
        >
          <template #item="{ element: service, index }">
            <div class="selected-item">
              <GripVertical :size="16" class="drag-handle" aria-hidden="true" />
              <img :src="service.icon" alt="" />
              <span>{{ service.name }}</span>
              <button
                type="button"
                class="icon-button ui-button ui-button--ghost ui-icon-button"
                :disabled="index === 0"
                :aria-label="`Move ${service.name} earlier`"
                @click="moveService(index, -1)"
              >
                <ArrowUp :size="15" />
              </button>
              <button
                type="button"
                class="icon-button ui-button ui-button--ghost ui-icon-button"
                :disabled="index === selectedServices.length - 1"
                :aria-label="`Move ${service.name} later`"
                @click="moveService(index, 1)"
              >
                <ArrowDown :size="15" />
              </button>
              <button
                type="button"
                class="icon-button ui-button ui-button--ghost ui-icon-button"
                :aria-label="`Remove ${service.name}`"
                @click="toggleService(service.id)"
              >
                <X :size="15" />
              </button>
            </div>
          </template>
        </draggable>
      </div>
      <div v-if="atServiceLimit" class="limit-message">
        Your 5 services are ready.
        <button type="button" @click="goToSettings">
          Get unlimited services
        </button>
      </div>
      <div class="selection-bar">
        <div class="selection-summary" aria-live="polite">
          <div
            class="selection-avatars"
            v-if="selectedServices.length"
            aria-hidden="true"
          >
            <img
              v-for="service in selectedServices.slice(0, 3)"
              :key="service.id"
              :src="service.icon"
              alt=""
            />
          </div>
          <span v-else class="selection-placeholder" aria-hidden="true">
            <Plus :size="19" />
          </span>
          <div>
            <span class="selection-count">
              {{ servicesStore.selectedServices.length }}
              {{
                servicesStore.selectedServices.length === 1
                  ? "service"
                  : "services"
              }}
              selected
            </span>
            <button
              v-if="selectedServices.length"
              type="button"
              class="review-selection"
              :aria-expanded="showSelection"
              aria-controls="selected-services"
              @click="showSelection = !showSelection"
            >
              Review selection
              <ChevronUp :size="12" :class="{ rotated: showSelection }" />
            </button>
            <span v-else class="selection-hint">
              Choose a favorite to get started
            </span>
          </div>
        </div>
        <button
          type="button"
          class="continue-button ui-button ui-button--primary"
          :disabled="!servicesStore.hasSelectedServices"
          @click="goToHome"
        >
          Continue
          <ArrowRight :size="17" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useRouter } from 'vue-router'
import { Search, Check, Plus, X, ArrowRight, ArrowUp, ArrowDown, ChevronUp, GripVertical } from 'lucide-vue-next'
import { useServicesStore } from '@/stores/services'
import { useProducts } from '@/composables/products'
import draggable from 'vuedraggable'

const router = useRouter()
const servicesStore = useServicesStore()
const { isPro } = useProducts()
const serviceQuery = ref('')
const showInstalledOnly = ref(false)
const showSelection = ref(false)
const categoryFilter = ref('all')

const categories = [
  { id: 'all', label: 'All services' },
  { id: 'watch', label: 'Streaming' },
  { id: 'track', label: 'Tracking' },
  { id: 'servers', label: 'Your servers' },
  { id: 'discover', label: 'Databases & reviews' },
]
const groups = [
  { id: 'watch', title: 'Watch & stream', ids: ['netflix', 'prime_video', 'disney_plus', 'max', 'apple_tv_plus', 'paramount_plus', 'youtube', 'mubi', 'peacock', 'hulu', 'crunchyroll', 'itunes', 'googleplay'] },
  { id: 'track', title: 'Keep track of your favorites', ids: ['trakt', 'letterboxd', 'moviebase', 'simkl', 'betaseries', 'anilist', 'ava_assistant'] },
  { id: 'servers', title: 'Your media, your way', ids: ['plex', 'jellyfin', 'kodi', 'seerr', 'sonarr', 'radarr', 'emby', 'nzb360', 'floppy', 'yamtrack'] },
  { id: 'discover', title: 'Discover a little more', ids: [] as string[] },
]
const catalog = computed(() => servicesStore.availableServices.filter(service => !('isInstance' in service)))
const selectedServices = computed({
  get: () => servicesStore.selectedServices,
  set: services => servicesStore.reorderServices(services),
})
const atServiceLimit = computed(() => !isPro.value && selectedServices.value.filter(service => !('isInstance' in service)).length >= 5)
const availableServices = computed(() => {
  const query = serviceQuery.value.trim().toLowerCase()
  return catalog.value.filter(service =>
    `${service.name} ${service.description}`.toLowerCase().includes(query) &&
    (!showInstalledOnly.value || servicesStore.isServiceInstalled(service))
  )
})
const visibleGroups = computed(() => groups.map(group => ({
  ...group,
  services: availableServices.value.filter(service => {
    const groupId = groups.find(candidate => candidate.ids.includes(service.id))?.id || 'discover'
    return groupId === group.id
  }),
})).filter(group => group.services.length && (categoryFilter.value === 'all' || group.id === categoryFilter.value)))

function toggleService(serviceId: string) {
  if (atServiceLimit.value && !servicesStore.isServiceSelected(serviceId)) return
  servicesStore.toggleService(serviceId)
  if (!selectedServices.value.length) showSelection.value = false
}
function moveService(index: number, direction: number) {
  const services = [...selectedServices.value]
  const target = index + direction
  if (target < 0 || target >= services.length) return
  const [service] = services.splice(index, 1)
  services.splice(target, 0, service)
  selectedServices.value = services
}
function resetFilters() {
  serviceQuery.value = ''
  categoryFilter.value = 'all'
  showInstalledOnly.value = false
}
function goToHome() {
  if (servicesStore.hasSelectedServices) void router.push('/home')
}
function goToSettings() { void router.push({ name: 'settings' }) }
onMounted(() => { void servicesStore.checkInstalledApps() })
</script>

<style scoped>
.service-picker {
  min-height: 100vh;
  background: var(--color-canvas);
  color: var(--color-ink);
  padding-bottom: calc(130px + env(safe-area-inset-bottom, 0px));
}
.picker-shell {
  margin: 0 auto;
}
.header-note {
  color: var(--color-subtle);
  font-size: 12px;
}
.picker-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.service-search {
  width: 100%;
  max-width: 430px;
}
.catalog-count,
.installed-filter {
  color: var(--color-subtle);
  font-size: 12px;
}
.installed-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.installed-filter input {
  accent-color: var(--color-accent);
}
.category-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 14px 0 22px;
}
.service-groups {
  display: grid;
  gap: 30px;
}
.group-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.group-heading h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 550;
  color: var(--color-ink);
}
.group-heading > span {
  font-size: 10px;
  color: var(--color-subtle);
  border: 1px solid var(--color-line);
  border-radius: 5px;
  padding: 0 5px;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.picker-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 14px;
  min-height: 94px;
  background: var(--color-surface);
  border: 1px solid var(--color-line-soft);
  border-radius: 11px;
  cursor: pointer;
  transition: border-color 150ms, background 150ms;
}
.picker-card:hover {
  background: var(--color-hover);
  border-color: var(--color-subtle);
}
.picker-card.is-selected {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
.picker-card:has(input:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.picker-card:has(input:disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}
.picker-card > input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.service-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: var(--color-raised);
  border-radius: 10px;
  overflow: hidden;
}
.service-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.service-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.service-name {
  font-size: 13px;
  font-weight: 550;
  color: var(--color-ink);
}
.service-description {
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.installed-status {
  color: var(--color-success);
  font-size: 10px;
}
.selection-check {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
  width: 17px;
  height: 17px;
  border: 1px solid var(--color-subtle);
  border-radius: 5px;
  display: grid;
  place-items: center;
  color: var(--color-on-accent);
}
.is-selected .selection-check {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.picker-footnote {
  margin: 28px 0 0;
  text-align: center;
  color: var(--color-subtle);
  font-size: 12px;
}
.empty-services {
  text-align: center;
  padding: 60px 16px;
  color: var(--color-muted);
  border: 1px dashed var(--color-line);
  border-radius: 12px;
}
.empty-services > svg {
  margin: 0 auto 14px;
}
.empty-services h2 {
  font-size: 17px;
  color: var(--color-ink);
  margin: 0 0 8px;
}
.empty-services p {
  font-size: 13px;
}
.empty-services button {
  margin-top: 15px;
  color: var(--color-accent);
  background: transparent;
  border: 0;
  text-decoration: underline;
  cursor: pointer;
}
.selection-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-surface) 96%, transparent);
  border-top: 1px solid var(--color-line);
  backdrop-filter: blur(16px);
  padding: 0 var(--space-page) env(safe-area-inset-bottom, 0px);
}
.selection-bar {
  max-width: var(--content-width);
  margin: 0 auto;
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.selection-summary {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.selection-placeholder {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--color-line);
  border-radius: 10px;
  color: var(--color-subtle);
}
.selection-count {
  display: block;
  font-size: 13px;
  font-weight: 550;
  color: var(--color-ink);
}
.selection-hint {
  font-size: 11px;
  color: var(--color-muted);
}
.review-selection {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-accent);
  font-size: 11px;
  background: none;
  border: 0;
  padding: 3px 0;
  cursor: pointer;
}
.rotated {
  transform: rotate(180deg);
}
.selection-avatars {
  display: flex;
  padding-left: 4px;
}
.selection-avatars img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background: var(--color-raised);
  border-radius: 9px;
  border: 2px solid var(--color-surface);
  margin-left: -4px;
}
.continue-button {
  gap: 22px;
  padding-inline: 21px;
}
.selection-panel {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 20px 0 4px;
}
.selection-panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.selection-panel h2 {
  font-size: 15px;
  margin: 0 0 3px;
}
.selection-panel p {
  font-size: 11px;
  color: var(--color-muted);
  margin: 0;
}
.selected-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}
.selected-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px;
  border: 1px solid var(--color-line);
  background: var(--color-raised);
  border-radius: 8px;
}
.selected-item > img {
  width: 23px;
  height: 23px;
  border-radius: 5px;
  object-fit: contain;
}
.selected-item > span {
  flex: 1;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon-button {
  width: 28px;
  min-height: 28px;
  padding: 5px;
}
.drag-handle {
  flex-shrink: 0;
  color: var(--color-subtle);
  cursor: grab;
}
.selection-ghost {
  opacity: 0.3;
}
.limit-message {
  max-width: var(--content-width);
  margin: 0 auto;
  padding-top: 12px;
  color: var(--color-muted);
  font-size: 12px;
}
.limit-message button {
  background: none;
  border: 0;
  color: var(--color-accent);
  text-decoration: underline;
  cursor: pointer;
}
.selection-open {
  padding-bottom: 400px;
}
@media (max-width: 900px) {
  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .selected-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 580px) {
  .header-note,
  .catalog-count {
    display: none;
  }
  .picker-intro {
    padding-top: 28px;
    padding-bottom: 22px;
  }
  .picker-intro > p:last-child {
    max-width: 300px;
    font-size: 13px;
  }
  .service-search {
    max-width: none;
  }
  .picker-toolbar {
    flex-wrap: wrap;
    gap: 12px;
  }
  .category-filters {
    gap: 4px;
    padding: 16px 0 22px;
  }
  .category-filters button {
    font-size: 11px;
    padding: 7px 9px;
  }
  .service-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .picker-card {
    min-height: 82px;
    padding: 14px;
  }
  .service-name {
    font-size: 14px;
  }
  .service-description {
    font-size: 12px;
  }
  .selection-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  .selection-bar {
    min-height: 82px;
    gap: 10px;
  }
  .selection-summary {
    gap: 10px;
  }
  .selection-hint {
    font-size: 10px;
  }
  .selection-avatars img {
    width: 25px;
    height: 25px;
  }
  .continue-button {
    gap: 10px;
    padding: 0 14px;
  }
  .selected-list {
    grid-template-columns: 1fr;
  }
  .selection-panel {
    padding-top: 16px;
  }
}
@media (max-width: 380px) {
  .selection-avatars,
  .selection-placeholder {
    display: none;
  }
  .selection-hint {
    display: block;
    max-width: 140px;
    line-height: 1.4;
  }
  .continue-button {
    font-size: 12px;
    gap: 8px;
    padding: 0 12px;
  }
}
</style>
