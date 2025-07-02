import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Device } from '@capacitor/device'
import type { Service, ServiceCategory, ServiceCategoryInfo } from '@/types'
import servicesData from '@/data/services'

export const useServicesStore = defineStore('services', () => {
  // Initialize with clean services data
  const availableServices = ref<Service[]>(servicesData)
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
    // Check if the service ID is in the installedApps array
    return installedApps.value.includes(service.id) || service.isInstalled || false
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
      const { AppLauncher } = await import('@capacitor/app-launcher')
      const deviceInfo = await Device.getInfo()
      isNative.value = deviceInfo.platform !== 'web'
      
      // Clear the installed apps array
      installedApps.value = []

      if (!isNative.value) {
        // In web environment, mark all services as available
        availableServices.value.forEach(service => {
          service.isInstalled = true
        })
        return
      }

      // Create a new array to avoid modifying the original while iterating
      const updatedServices = [...availableServices.value]
      
      // Check each service that has a package name
      for (let i = 0; i < updatedServices.length; i++) {
        const service = updatedServices[i]
        try {
          if (service.androidAppId) {
            // For Android, we can try to open the package
            const { value: canOpen } = await AppLauncher.canOpenUrl({ 
              url: service.androidAppId 
            })
            service.isInstalled = canOpen
            
            if (canOpen) {
              installedApps.value.push(service.id) // Store only the service ID
            }
          } else {
            // If no package is provided, assume it's a web service
            service.isInstalled = true
          }
        } catch (error) {
          console.warn(`Error checking if ${service.name} is installed:`, error)
          service.isInstalled = false
        }
      }
      
      // Update the services array
      availableServices.value = updatedServices
    } catch (error) {
      console.error('Error in checkInstalledApps:', error)
      // Fallback: mark all services as available
      availableServices.value.forEach(service => {
        service.isInstalled = true
      })
    }
  }

  const saveToLocalStorage = () => {
    try {
      // Only save the essential data (selected service IDs)
      const dataToSave = {
        selectedServiceIds: selectedServiceIds.value,
      }
      localStorage.setItem('servicesState', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('servicesState')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Only restore the data we need
        if (Array.isArray(parsed.selectedServiceIds)) {
          selectedServiceIds.value = parsed.selectedServiceIds.filter((id: string) => 
            availableServices.value.some(s => s.id === id)
          )
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem('servicesState')
    }
  }

  const hasSelectedServices = computed(() => selectedServiceIds.value.length > 0)

  const getCategoryInfo = (categoryId: ServiceCategory): ServiceCategoryInfo => {
    return serviceCategories.find(cat => cat.id === categoryId) || serviceCategories[0]
  }

  // Initialize the store
  const initStore = async () => {
    try {
      await checkInstalledApps()
     // loadFromLocalStorage()
    } catch (error) {
      console.error('Error initializing services store:', error)
    }
  }

  // Call init immediately
  initStore()

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
    getCategoryInfo,
    initStore // Expose initStore in case it needs to be called manually
  }
})