<template>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-6xl w-full">
        <!-- Header -->
        <div class="text-center mb-12 animate-fade-in">
          <h1 class="text-5xl font-bold gradient-text mb-4">
            Movie Hub
          </h1>
          <p class="text-xl text-gray-300 mb-4">
            Choose your movie apps and services
          </p>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
            <span v-if="servicesStore.isNative" class="flex items-center gap-1">
              📱 {{ servicesStore.installedServices.length }} apps detected
            </span>
            <span v-else class="flex items-center gap-1">
              🌐 Web version - all services available
            </span>
          </div>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>
  
        <!-- Filter Tabs -->
        <div class="relative mb-6">
          <div class="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>
          <div class="flex overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none">
            <div class="flex space-x-2">
              <button
                @click="selectedCategory = null"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
                :class="selectedCategory === null 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
              >
                All ({{ availableServicesFiltered.length }})
              </button>
              <button
                v-for="category in servicesStore.serviceCategories"
                :key="category.id"
                @click="selectedCategory = category.id"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                :class="selectedCategory === category.id 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
              >
                <span class="text-xs">{{ category.icon }}</span>
                <span>{{ category.name }}</span>
                <span class="opacity-70 text-[0.7rem]">({{ servicesStore.servicesByCategory[category.id].length }})</span>
              </button>
            </div>
          </div>
        </div>
  
        <!-- Show installed apps only toggle -->
        <div v-if="servicesStore.isNative" class="flex justify-center mb-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="showInstalledOnly"
              type="checkbox"
              class="rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
            >
            <span class="text-gray-300">Show only installed apps</span>
          </label>
        </div>
  
        <!-- Category Description -->
        <div v-if="selectedCategory" class="text-center mb-8">
          <div class="glass-effect rounded-xl p-4 max-w-md mx-auto">
            <div class="text-2xl mb-2">{{ currentCategoryInfo.icon }}</div>
            <h3 class="text-lg font-semibold text-white mb-1">{{ currentCategoryInfo.name }}</h3>
            <p class="text-gray-400 text-sm">{{ currentCategoryInfo.description }}</p>
          </div>
        </div>
  
        <!-- Services Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 mb-12">
          <div
            v-for="service in availableServicesFiltered"
            :key="service.id"
            @click="servicesStore.toggleService(service.id)"
            class="service-card glass-effect rounded-lg p-2.5 cursor-pointer animate-slide-up relative hover:bg-white/5 transition-colors"
            :class="{ 
              'selected': servicesStore.isServiceSelected(service.id),
              'opacity-60': !servicesStore.isServiceInstalled(service)
            }"
            :style="{ animationDelay: `${availableServicesFiltered.indexOf(service) * 0.05}s` }"
          >
            <!-- Installation status indicator -->
            <div class="absolute top-1.5 right-1.5">
              <div
                v-if="servicesStore.isServiceInstalled(service)"
                class="w-2.5 h-2.5 bg-green-500 rounded-full"
                title="Installed"
              ></div>
              <div
                v-else-if="service.androidAppId"
                class="w-2.5 h-2.5 bg-gray-500 rounded-full"
                title="Not installed"
              ></div>
              <div
                v-else
                class="w-2.5 h-2.5 bg-blue-500 rounded-full"
                title="Web service"
              ></div>
            </div>
  
            <div class="flex items-center gap-2 w-full">
              <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <span v-if="service.icon" class="text-lg">{{ service.icon }}</span>
                <span v-else class="text-xs text-gray-400">{{ service.name.charAt(0) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-xs text-white truncate">{{ service.name }}</h3>
                <p class="text-[0.65rem] text-gray-400 line-clamp-2 leading-tight">{{ service.description }}</p>
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
              'animate-pulse': !servicesStore.hasSelectedServices
            }"
          >
            {{ servicesStore.hasSelectedServices 
              ? `Continue with ${servicesStore.selectedServices.length} service${servicesStore.selectedServices.length > 1 ? 's' : ''}`
              : 'Select at least one service to continue'
            }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useServicesStore } from '@/stores/services'
  import type { ServiceCategory } from '@/types'
  
  const router = useRouter()
  const servicesStore = useServicesStore()
  
  const selectedCategory = ref<ServiceCategory | null>(null)
  const showInstalledOnly = ref(false)
  
  const currentCategoryInfo = computed(() => {
    if (!selectedCategory.value) return { icon: '🎬', name: 'All Services', description: 'All available movie apps and services' }
    return servicesStore.getCategoryInfo(selectedCategory.value)
  })
  
  const availableServicesFiltered = computed(() => {
    let services = servicesStore.availableServices
  
    // Filter by category
    if (selectedCategory.value) {
      services = servicesStore.servicesByCategory[selectedCategory.value]
    }
  
    // Filter by installation status
    if (showInstalledOnly.value && servicesStore.isNative) {
      services = services.filter(service => servicesStore.isServiceInstalled(service))
    }
  
    return services
  })
  
  const goToHome = () => {
    if (servicesStore.hasSelectedServices) {
      router.push('/home')
    }
  }
  
  onMounted(async () => {
    await servicesStore.checkInstalledApps()
  })
  </script>
  
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
  </style>