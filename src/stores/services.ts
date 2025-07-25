import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Device } from '@capacitor/device'
import type { Service } from '@/types'
import servicesData from '@/data/services'

export const useServicesStore = defineStore('services', () => {
  // Initialize with clean services data
  const availableServices = ref<Service[]>(servicesData)
  const selectedServiceIds = ref<string[]>([])
  const installedApps = ref<string[]>([])
  const isNative = ref(false)

  const selectedServices = computed(() => {
    // Create a map for quick lookup
    const servicesMap = new Map(availableServices.value.map(s => [s.id, s]));
    // Return services in the same order as selectedServiceIds
    return selectedServiceIds.value
      .map(id => servicesMap.get(id))
      .filter((service): service is Service => service !== undefined);
  })

  const installedServices = computed(() => 
    availableServices.value // All services are available, we just filter by selection
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

  const reorderServices = (reorderedServices: Service[]) => {
    // Create a map of service IDs to their order
    const newOrder = new Map(reorderedServices.map((service, index) => [service.id, index]));
    
    // Sort the selectedServiceIds array based on the new order
    selectedServiceIds.value = [...selectedServiceIds.value].sort((a, b) => {
      return (newOrder.get(a) ?? Infinity) - (newOrder.get(b) ?? Infinity);
    });
    
    saveToLocalStorage();
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

  // Initialize the store
  const initStore = async () => {
    try {
      await checkInstalledApps()
      loadFromLocalStorage()
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
    installedApps,
    isNative,
    isServiceSelected,
    isServiceInstalled,
    toggleService,
    reorderServices,
    checkInstalledApps,
    loadFromLocalStorage,
    hasSelectedServices,
    initStore // Expose initStore in case it needs to be called manually
  }
})