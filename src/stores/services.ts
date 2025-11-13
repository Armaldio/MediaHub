import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Device } from '@capacitor/device'
import { v4 as uuidv4 } from 'uuid'
import type { Service, CustomServiceInstance } from '@/types'
import servicesData from '@/data/services'

// Extend Service type for instance services
interface InstanceService extends Service {
  isInstance: true
  instanceId: string
  parentServiceId: string
  instanceData: CustomServiceInstance
}

export const useServicesStore = defineStore('services', () => {
  // Initialize with clean services data and convert instances to separate services
  const initializeServices = (): (Service | InstanceService)[] => {
    const services: (Service | InstanceService)[] = []

    // Add all regular services
    servicesData.forEach(service => {
      // Ensure customInstances is always an array
      const serviceWithInstances: Service = {
        ...service,
        customInstances: service.customInstances || []
      }

      services.push(serviceWithInstances)

      // Add all instances as separate services
      if (service.supportsCustomInstances && service.customInstances?.length > 0) {
        service.customInstances.forEach(instance => {
          services.push({
            ...serviceWithInstances,
            id: `${serviceWithInstances.id}-${instance.id}`,
            name: `${serviceWithInstances.name} (${instance.name})`,
            description: `Instance of ${serviceWithInstances.name}`,
            isInstance: true,
            instanceId: instance.id,
            parentServiceId: serviceWithInstances.id,
            instanceData: instance
          } as InstanceService)
        })
      }
    })

    return services
  }

  const availableServices = ref<(Service | InstanceService)[]>(initializeServices())

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
    const parentService = availableServices.value.find(s => s.id === serviceId && !('isInstance' in s)) as Service | undefined
    if (!parentService) return null

    const newInstance: CustomServiceInstance = {
      ...instance,
      id: uuidv4(),
      isDefault: instance.isDefault ?? false
    }

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    // If this is set as default, unset any existing default
    if (newInstance.isDefault) {
      parentService.customInstances.forEach(i => { i.isDefault = false })
    } else if (parentService.customInstances.length === 0) {
      // If this is the first instance, make it default
      newInstance.isDefault = true
    }

    // Create the instance service
    const instanceService: InstanceService = {
      ...parentService,
      id: `${parentService.id}-${newInstance.id}`,
      name: `${parentService.name} (${newInstance.name})`,
      description: `Instance of ${parentService.name}`,
      isInstance: true,
      instanceId: newInstance.id,
      parentServiceId: parentService.id,
      instanceData: newInstance
    }

    // Add to available services and update parent
    parentService.customInstances.push(newInstance)
    availableServices.value.push(instanceService)

    saveToLocalStorage()
    return newInstance
  }

  const updateCustomInstance = (serviceId: string, instanceId: string, updates: Partial<CustomServiceInstance>) => {
    const parentService = availableServices.value.find(s => s.id === serviceId && !('isInstance' in s)) as Service | undefined
    if (!parentService) return null

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    // Find the instance in the parent service
    const instanceIndex = parentService.customInstances.findIndex(i => i.id === instanceId)
    if (instanceIndex === -1) return null

    const updatedInstance = {
      ...parentService.customInstances[instanceIndex],
      ...updates,
      id: instanceId // Ensure ID can't be changed
    }

    // If this is being set as default, unset any existing default
    if (updates.isDefault) {
      parentService.customInstances.forEach((i, idx) => {
        if (i.id !== instanceId) {
          parentService.customInstances[idx].isDefault = false
        }
      })
    }

    parentService.customInstances[instanceIndex] = updatedInstance

    // Update the corresponding instance service
    const instanceServiceIndex = availableServices.value.findIndex(s =>
      s.id === `${serviceId}-${instanceId}` && 'isInstance' in s
    )

    if (instanceServiceIndex !== -1) {
      const instanceService = availableServices.value[instanceServiceIndex] as InstanceService
      instanceService.instanceData = updatedInstance
      instanceService.name = `${parentService.name} (${updatedInstance.name})`
    }

    saveToLocalStorage()
    return updatedInstance
  }

  const removeCustomInstance = (serviceId: string, instanceId: string) => {
    const parentService = availableServices.value.find(s => s.id === serviceId && !('isInstance' in s)) as Service | undefined
    if (!parentService) return false

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    const instanceIndex = parentService.customInstances.findIndex(i => i.id === instanceId)
    if (instanceIndex === -1) return false

    const wasDefault = parentService.customInstances[instanceIndex].isDefault
    const wasLastInstance = parentService.customInstances.length === 1

    // Remove from parent service
    parentService.customInstances.splice(instanceIndex, 1)

    // Remove the corresponding instance service
    const instanceServiceIndex = availableServices.value.findIndex(s =>
      s.id === `${serviceId}-${instanceId}` && 'isInstance' in s
    )

    if (instanceServiceIndex !== -1) {
      availableServices.value.splice(instanceServiceIndex, 1)
    }

    // If we removed the default and there are other instances, make the first one default
    if (wasDefault && !wasLastInstance && parentService.customInstances.length > 0) {
      parentService.customInstances[0].isDefault = true
    }

    saveToLocalStorage()
    return true
  }

  const getDefaultInstance = (serviceId: string): CustomServiceInstance | null => {
    const parentService = availableServices.value.find(s => s.id === serviceId && !('isInstance' in s)) as Service | undefined
    if (!parentService) return null

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    return parentService.customInstances.find(i => i.isDefault) || parentService.customInstances[0] || null
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