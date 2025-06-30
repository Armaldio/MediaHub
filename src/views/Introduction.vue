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
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            @click="selectedCategory = null"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="selectedCategory === null 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          >
            All Services ({{ availableServicesFiltered.length }})
          </button>
          <button
            v-for="category in servicesStore.serviceCategories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1"
            :class="selectedCategory === category.id 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          >
            <span>{{ category.icon }}</span>
            {{ category.name }} ({{ servicesStore.servicesByCategory[category.id].length }})
          </button>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          <div
            v-for="service in availableServicesFiltered"
            :key="service.id"
            @click="servicesStore.toggleService(service.id)"
            class="service-card glass-effect rounded-xl p-4 cursor-pointer animate-slide-up relative"
            :class="{ 
              'selected': servicesStore.isServiceSelected(service.id),
              'opacity-60': !servicesStore.isServiceInstalled(service)
            }"
            :style="{ animationDelay: `${availableServicesFiltered.indexOf(service) * 0.05}s` }"
          >
            <!-- Installation status indicator -->
            <div class="absolute top-2 right-2">
              <div
                v-if="servicesStore.isServiceInstalled(service)"
                class="w-3 h-3 bg-green-500 rounded-full"
                title="Installed"
              ></div>
              <div
                v-else-if="service.androidAppId"
                class="w-3 h-3 bg-gray-500 rounded-full"
                title="Not installed"
              ></div>
              <div
                v-else
                class="w-3 h-3 bg-blue-500 rounded-full"
                title="Web service"
              ></div>
            </div>
  
            <div class="text-center">
              <div class="text-3xl mb-3">{{ service.icon }}</div>
              <h3 class="text-base font-semibold text-white mb-1">{{ service.name }}</h3>
              <p class="text-gray-400 text-xs mb-3 line-clamp-2">{{ service.description }}</p>
              
              <!-- Category badge -->
              <div class="mb-3">
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                  {{ servicesStore.getCategoryInfo(service.category).icon }}
                  {{ servicesStore.getCategoryInfo(service.category).name }}
                </span>
              </div>
  
              <div
                class="w-full h-1 rounded-full"
                :style="{ backgroundColor: service.color }"
              ></div>
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
  </style>