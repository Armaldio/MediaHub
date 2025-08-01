import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Device } from '@capacitor/device'
import { v4 as uuidv4 } from 'uuid'
import type { Service, CustomServiceInstance } from '@/types'
import servicesData from '@/data/services'

export const useServicesStore = defineStore('services', () => {
  // Initialize with clean services data
  const availableServices = ref<Service[]>(servicesData.map(service => ({
    ...service,
    customInstances: service.customInstances || []
  })))
  const selectedServiceIds = ref<string[]>([])
  const installedApps = ref<string[]>([])
  const isNative = ref(false)
  const customInstances = ref<Record<string, CustomServiceInstance[]>>({})

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
      // Prepare custom instances data
      const customInstancesToSave: Record<string, CustomServiceInstance[]> = {}
      availableServices.value.forEach(service => {
        if (service.customInstances?.length) {
          customInstancesToSave[service.id] = service.customInstances
        }
      })

      // Save all data
      const dataToSave = {
        selectedServiceIds: selectedServiceIds.value,
        customInstances: customInstancesToSave
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
        // Restore selected service IDs
        if (Array.isArray(parsed.selectedServiceIds)) {
          selectedServiceIds.value = parsed.selectedServiceIds.filter((id: string) => 
            availableServices.value.some(s => s.id === id)
          )
        }
        // Restore custom instances
        if (parsed.customInstances) {
          customInstances.value = parsed.customInstances
          // Update services with their custom instances
          availableServices.value = availableServices.value.map(service => ({
            ...service,
            customInstances: parsed.customInstances?.[service.id] || []
          }))
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      // Clear corrupted data but preserve custom instances
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

  // Custom instance management
  const addCustomInstance = (serviceId: string, instance: Omit<CustomServiceInstance, 'id'>) => {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (!service) return null

    const newInstance: CustomServiceInstance = {
      ...instance,
      id: uuidv4(),
      isDefault: instance.isDefault ?? false
    }

    if (!service.customInstances) {
      service.customInstances = []
    }

    // If this is set as default, unset any existing default
    if (newInstance.isDefault) {
      service.customInstances.forEach(i => { i.isDefault = false })
    } else if (service.customInstances.length === 0) {
      // If this is the first instance, make it default
      newInstance.isDefault = true
    }

    service.customInstances.push(newInstance)
    saveToLocalStorage()
    return newInstance
  }

  const updateCustomInstance = (serviceId: string, instanceId: string, updates: Partial<CustomServiceInstance>) => {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (!service?.customInstances) return null

    const instanceIndex = service.customInstances.findIndex(i => i.id === instanceId)
    if (instanceIndex === -1) return null

    const updatedInstance = {
      ...service.customInstances[instanceIndex],
      ...updates,
      id: instanceId // Ensure ID can't be changed
    }

    // If this is being set as default, unset any existing default
    if (updates.isDefault) {
      service.customInstances.forEach((i, idx) => {
        if (i.id !== instanceId) {
          service.customInstances![idx].isDefault = false
        }
      })
    }

    service.customInstances[instanceIndex] = updatedInstance
    saveToLocalStorage()
    return updatedInstance
  }

  const removeCustomInstance = (serviceId: string, instanceId: string) => {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (!service?.customInstances) return false

    const instanceIndex = service.customInstances.findIndex(i => i.id === instanceId)
    if (instanceIndex === -1) return false

    const wasDefault = service.customInstances[instanceIndex].isDefault
    const wasLastInstance = service.customInstances.length === 1

    service.customInstances.splice(instanceIndex, 1)

    // If we removed the default and there are other instances, make the first one default
    if (wasDefault && !wasLastInstance && service.customInstances.length > 0) {
      service.customInstances[0].isDefault = true
    }

    saveToLocalStorage()
    return true
  }

  const getDefaultInstance = (serviceId: string): CustomServiceInstance | null => {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (!service?.customInstances?.length) return null
    
    return service.customInstances.find(i => i.isDefault) || service.customInstances[0] || null
  }

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
    initStore,
    // Custom instance methods
    addCustomInstance,
    updateCustomInstance,
    removeCustomInstance,
    getDefaultInstance
  }
})