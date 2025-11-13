<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-6xl w-full">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-5xl font-bold gradient-text mb-4">Movie Hub</h1>
        <p class="text-xl text-gray-300 mb-4">
          Choose your movie apps and services
        </p>
        <div
          class="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8"
        >
          <span v-if="servicesStore.isNative" class="flex items-center gap-1">
            📱 {{ servicesStore.installedServices.length }} apps detected
          </span>
        </div>
        <div
          class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
        ></div>
      </div>

      <!-- Show installed apps only toggle -->
      <div v-if="servicesStore.isNative" class="flex justify-center mb-8">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="showInstalledOnly"
            type="checkbox"
            class="rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
          />
          <span class="text-gray-300">Show only installed apps</span>
        </label>
      </div>

      <!-- Selected Services (Reorderable) -->
      <div v-if="selectedServices.length > 0" class="mb-8">
        <h3 class="text-lg font-medium text-gray-300 mb-4">
          Selected Services (Drag to reorder)
        </h3>
        <div class="bg-gray-800/50 rounded-xl p-4">
          <draggable
            v-model="selectedServices"
            item-key="id"
            class="flex flex-wrap gap-3"
            :delay-on-touch-only="true"
            delay="100"
            v-bind="dragOptions"
            @start="drag = true"
            @end="onDragEnd"
          >
            <template #item="{ element: service }">
              <div
                class="service-card glass-effect rounded-lg p-2.5 cursor-move flex-shrink-0 w-40"
                :class="{ selected: true }"
                @click.stop
              >
                <div class="flex items-center gap-2 w-full relative z-10">
                  <div
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden"
                  >
                    <img
                      v-if="service.icon"
                      :src="service.icon"
                      :alt="service.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-xs text-gray-400">{{
                      service.name.charAt(0)
                    }}</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-medium text-xs text-white truncate">
                      {{ service.name }}
                    </h3>
                  </div>
                  <button
                    @click.stop="toggleService(service.id)"
                    class="text-gray-400 hover:text-white transition-colors"
                    title="Remove service"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Available Services -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 mb-12"
      >
        <div
          v-for="service in availableServices"
          :key="service.id"
          @click="toggleService(service.id)"
          class="service-card glass-effect rounded-lg p-2.5 cursor-pointer animate-slide-up relative transition-all"
          :class="{
            selected: servicesStore.isServiceSelected(service.id),
            'not-selected': !servicesStore.isServiceSelected(service.id),
          }"
          :style="{
            opacity: servicesStore.isServiceSelected(service.id) ? 0.5 : 1,
          }"
        >
          <!-- Service status indicator -->
          <div
            class="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end"
            @click.stop
          >
            <!-- Selected checkmark (always show when selected) -->
            <div
              v-if="servicesStore.isServiceSelected(service.id)"
              class="w-5 h-5 flex items-center justify-center bg-indigo-600 rounded-full text-white pointer-events-none"
              title="Selected"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Native app indicator -->
            <div
              v-if="
                service.androidAppId &&
                servicesStore.isServiceInstalled(service)
              "
              class="w-5 h-5 flex items-center justify-center bg-green-600/90 rounded-full text-white text-xs pointer-events-none"
              title="Native app installed"
            >
              📱
            </div>
            <!-- Dot for web-only services with native app option -->
            <div
              v-else-if="service.androidAppId"
              class="w-4 h-4 flex items-center justify-center bg-blue-600/90 rounded-full text-white text-[10px] pointer-events-none"
              title="Native app available but not installed"
            >
              ⬇️
            </div>
          </div>

          <div class="flex items-center gap-2 w-full relative z-10">
            <div
              class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden"
            >
              <img
                v-if="service.icon"
                :src="service.icon"
                :alt="service.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xs text-gray-400">{{
                service.name.charAt(0)
              }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-medium text-xs text-white truncate">
                {{ service.name }}
              </h3>
              <p
                class="text-[0.65rem] text-gray-400 line-clamp-2 leading-tight"
              >
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="text-center">
        <button
          @click="goToHome"
          :disabled="!servicesStore.hasSelectedServices"
          class="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'hover:scale-105': servicesStore.hasSelectedServices,
            'animate-pulse': !servicesStore.hasSelectedServices,
          }"
        >
          {{
            servicesStore.hasSelectedServices
              ? `Continue with ${
                  servicesStore.selectedServices.length
                } service${
                  servicesStore.selectedServices.length > 1 ? "s" : ""
                }`
              : "Select at least one service to continue"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.service-card {
  border: 1px solid transparent;
  transition: all 200ms ease;
}

.service-card {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.service-card.selected {
  border: 2px solid rgb(99 102 241);
  background-color: rgba(79, 70, 229, 0.15);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2),
    0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* .service-card.selected::after {
    content: '✓';
    position: absolute;
    top: -1px;
    right: -1px;
    width: 20px;
    height: 20px;
    background: #4f46e5;
    color: white;
    border-bottom-left-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  } */

.service-card.selected:hover {
  border-color: #818cf8;
  background-color: rgba(99, 102, 241, 0.2);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3),
    0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.service-card.not-selected {
  border-color: rgba(255, 255, 255, 0.05);
  background-color: rgba(255, 255, 255, 0.02);
}

.service-card.not-selected:hover {
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
}

/* Drag and drop styles */
.ghost {
  opacity: 0.5;
  background: #4f46e5;
}

.dragging {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drag-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}

.sortable-ghost {
  opacity: 0.5;
  background: #4f46e5;
}

.sortable-drag {
  opacity: 0.9;
  background: #4f46e5;
  cursor: move;
  cursor: -webkit-grabbing;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/stores/services";
import draggable from "vuedraggable";

const router = useRouter();
const servicesStore = useServicesStore();
const drag = ref(false);
const showInstalledOnly = ref(false);

const selectedServices = computed({
  get: () => servicesStore.selectedServices,
  set: (value) => {
    // Update the order in the store
    servicesStore.reorderServices(value);
  },
});

const availableServices = computed(() => {
  if (!showInstalledOnly.value) {
    return servicesStore.availableServices
  }
  return servicesStore.availableServices.filter(service =>
    !service.isInstance || servicesStore.isServiceInstalled(service)
  )
});

const dragOptions = computed(() => ({
  animation: 200,
  group: "services",
  disabled: false,
  ghostClass: "ghost",
  handle: ".cursor-move",
}));

const onDragEnd = () => {
  drag.value = false;
};

const goToHome = () => {
  if (servicesStore.hasSelectedServices) {
    router.push("/home");
  }
};

// Custom toggle method to handle instances
function toggleService(serviceId: string) {
  servicesStore.toggleService(serviceId)
}

onMounted(async () => {
  await servicesStore.checkInstalledApps();
});
</script>
