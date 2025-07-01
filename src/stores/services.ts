import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'
import type { Service, ServiceCategory, ServiceCategoryInfo } from '@/types'
import servicesData from '@/data/services'

export const useServicesStore = defineStore('services', () => {
  const availableServices = ref<Service[]>(servicesData as Service[])
  const selectedServiceIds = ref<string[]>([])
  const installedApps = ref<string[]>([])
  const isNative = ref(false)

  // Service categories configuration
  const serviceCategories: ServiceCategoryInfo[] = [
    {
      id: 'streaming',
      name: 'Streaming Services',
      description: 'Watch movies and TV shows',
      icon: '🎬'
    },
    {
      id: 'tracking',
      name: 'Tracking & Collection',
      description: 'Track and organize your watchlist',
      icon: '📊'
    },
    {
      id: 'social',
      name: 'Social & Reviews',
      description: 'Share and discover with others',
      icon: '👥'
    },
    {
      id: 'discovery',
      name: 'Discovery & Search',
      description: 'Find new content and where to watch',
      icon: '🔍'
    },
    {
      id: 'database',
      name: 'Information & Database',
      description: 'Movie and TV show information',
      icon: '📚'
    },
    {
      id: 'media_center',
      name: 'Media Centers',
      description: 'Personal media servers and players',
      icon: '🎞️'
    }
  ]

  const selectedServices = computed(() => 
    availableServices.value.filter(service => 
      selectedServiceIds.value.includes(service.id)
    )
  )

  const servicesByCategory = computed(() => {
    const categorized: Record<ServiceCategory, Service[]> = {
      streaming: [],
      tracking: [],
      social: [],
      discovery: [],
      database: [],
      media_center: []
    }

    availableServices.value.forEach(service => {
      categorized[service.category].push(service)
    })

    return categorized
  })

  const installedServices = computed(() => 
    availableServices.value.filter(service => 
      service.isInstalled || !service.androidAppId // Web services are always "available"
    )
  )

  const isServiceSelected = (serviceId: string) => 
    selectedServiceIds.value.includes(serviceId)

  const isServiceInstalled = (service: Service) => {
    if (!service.androidAppId) return true // Web services are always available
    return service.isInstalled || false
  }

  const toggleService = (serviceId: string) => {
    const index = selectedServiceIds.value.indexOf(serviceId)
    if (index > -1) {
      selectedServiceIds.value.splice(index, 1)
    } else {
      selectedServiceIds.value.push(serviceId)
    }
    saveToLocalStorage()
  }

  const checkInstalledApps = async () => {
    try {
      const deviceInfo = await Device.getInfo()
      isNative.value = deviceInfo.platform !== 'web'

      if (!isNative.value) {
        // In web environment, mark all services as available
        availableServices.value.forEach(service => {
          service.isInstalled = true
        })
        return
      }

      // Check each service with an Android app ID
      const appsToCheck = availableServices.value.filter(service => service.androidAppId)
      
      for (const service of appsToCheck) {
        try {
          // Try to get app info - if it throws, app is not installed
          await App.getInfo()
          // For now, we'll simulate app detection since Capacitor doesn't have direct app detection
          // In a real implementation, you'd use a native plugin for this
          service.isInstalled = Math.random() > 0.5 // Simulate random installation
          
          if (service.isInstalled) {
            installedApps.value.push(service.androidAppId)
          }
        } catch {
          service.isInstalled = false
        }
      }

      // Web services are always available
      availableServices.value
        .filter(service => !service.androidAppId)
        .forEach(service => {
          service.isInstalled = true
        })

    } catch (error) {
      console.error('Error checking installed apps:', error)
      // Fallback: mark all services as available
      availableServices.value.forEach(service => {
        service.isInstalled = true
      })
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('selectedServices', JSON.stringify(selectedServiceIds.value))
  }

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('selectedServices')
    if (stored) {
      selectedServiceIds.value = JSON.parse(stored)
    }
  }

  const hasSelectedServices = computed(() => selectedServiceIds.value.length > 0)

  const getCategoryInfo = (categoryId: ServiceCategory): ServiceCategoryInfo => {
    return serviceCategories.find(cat => cat.id === categoryId) || serviceCategories[0]
  }

  return {
    availableServices,
    selectedServices,
    selectedServiceIds,
    installedServices,
    servicesByCategory,
    serviceCategories,
    installedApps,
    isNative,
    isServiceSelected,
    isServiceInstalled,
    toggleService,
    checkInstalledApps,
    loadFromLocalStorage,
    hasSelectedServices,
    getCategoryInfo
  }
})