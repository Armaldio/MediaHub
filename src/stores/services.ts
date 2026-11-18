import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { v4 as uuidv4 } from 'uuid'
import type { Service, CustomServiceInstance } from '@/types'
import servicesData from '@/data/services'
import { withRequestTimeout } from '@/utils/requestTimeout'

// Extend Service type for instance services
interface InstanceService extends Service {
  isInstance: true
  instanceId: string
  parentServiceId: string
  instanceData: CustomServiceInstance
}

export const useServicesStore = defineStore('services', () => {
  // Parent services own instance data; flattened entries are derived for the UI.
  const parentServices = ref<Service[]>(servicesData.map(service => ({
    ...service,
    customInstances: []
  })))
  const availableServices = computed<(Service | InstanceService)[]>(() =>
    parentServices.value.flatMap(service => [
      service,
      ...(service.supportsCustomInstances ? service.customInstances || [] : []).map(instance => ({
        ...service,
        customInstances: undefined,
        id: `${service.id}-${instance.id}`,
        name: `${service.name} (${instance.name})`,
        description: `Instance of ${service.name}`,
        isInstance: true as const,
        instanceId: instance.id,
        parentServiceId: service.id,
        instanceData: instance
      }))
    ])
  )

  const selectedServiceIds = ref<string[]>([])
  const installedApps = ref<string[]>([])
  const isNative = Capacitor.getPlatform() !== 'web'
  const installedAppsLoading = ref(isNative)

  const selectedServices = computed(() => {
    // Create a map for quick lookup
    const servicesMap = new Map(availableServices.value.map(s => [s.id, s]));
    // Return services in the same order as selectedServiceIds
    return selectedServiceIds.value
      .map(id => servicesMap.get(id))
      .filter((service): service is Service => service !== undefined);
  })

  const installedServices = computed(() =>
    availableServices.value.filter((service) => !!service.androidAppId && isServiceInstalled(service))
  )

  const isServiceSelected = (serviceId: string) => 
    selectedServiceIds.value.includes(serviceId)

  const isServiceInstalled = (service: Service) => {
    if (!service.androidAppId) return false // Web-only: no native app to install
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

  const scanInstalledApps = async () => {
    const { AppLauncher } = await import('@capacitor/app-launcher')
    const results = await Promise.all(parentServices.value.map(async (service) => {
      if (!service.androidAppId) return null
      try {
        const { value } = await withRequestTimeout(AppLauncher.canOpenUrl({ url: service.androidAppId }), 5000)
        return value ? service.id : null
      } catch (error) {
        console.warn(`Error checking if ${service.name} is installed:`, error)
        return null
      }
    }))
    installedApps.value = results.filter(id => id !== null)
    for (const service of parentServices.value) {
      service.isInstalled = installedApps.value.includes(service.id)
    }
  }

  let installedAppsScan: Promise<void> | undefined
  const checkInstalledApps = () => {
    if (!isNative) return Promise.resolve()
    if (!installedAppsScan) {
      installedAppsLoading.value = true
      installedAppsScan = scanInstalledApps()
        .catch(error => console.error('Error in checkInstalledApps:', error))
        .finally(() => {
          installedAppsLoading.value = false
          installedAppsScan = undefined
        })
    }
    return installedAppsScan
  }

  const saveToLocalStorage = () => {
    try {
      // Prepare custom instances data
      const customInstancesToSave: Record<string, CustomServiceInstance[]> = {}
      parentServices.value.forEach(service => {
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
        const restoredInstances: Record<string, CustomServiceInstance[]> =
          parsed.customInstances || {}

        // Rebuild the service list so custom-instance entries are recreated
        // (their ids must match for saved selections to persist)
        parentServices.value = servicesData.map(service => ({
          ...service,
          isInstalled: installedApps.value.includes(service.id),
          customInstances: restoredInstances[service.id] || []
        }))

        // Restore selected service IDs (instance ids now exist again)
        const restored = Array.isArray(parsed.selectedServiceIds)
          ? parsed.selectedServiceIds.filter((id: string) =>
              availableServices.value.some(s => s.id === id)
            )
          : []

        selectedServiceIds.value = [...new Set<string>(restored)]
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      // Discard malformed persisted state.
      try {
        localStorage.removeItem('servicesState')
      } catch {
        // Storage can be blocked by the browser.
      }
    }
  }

  const preselectInstalledApps = () => {
    if (Capacitor.getPlatform() !== 'android' || selectedServiceIds.value.length) return
    if (localStorage.getItem('servicesState') !== null) return

    selectedServiceIds.value = [...installedApps.value]
    saveToLocalStorage()
  }

  const getInstancesForService = (serviceId: string): CustomServiceInstance[] => {
    const parent = parentServices.value.find(s => s.id === serviceId)
    if (!parent) return []
    return parent.customInstances || []
  }

  const hasSelectedServices = computed(() => selectedServiceIds.value.length > 0)

  // Initialize the store
  const initStore = async () => {
    try {
      loadFromLocalStorage()
      await checkInstalledApps()
    } catch (error) {
      console.error('Error initializing services store:', error)
    }
  }

  // Call init immediately
  initStore()

  // Custom instance management
  const addCustomInstance = (serviceId: string, instance: Omit<CustomServiceInstance, 'id'>) => {
    const parentService = parentServices.value.find(s => s.id === serviceId)
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

    parentService.customInstances.push(newInstance)

    // Newly created instances are selected; later loads respect saved choices.
    selectedServiceIds.value.push(`${serviceId}-${newInstance.id}`)

    saveToLocalStorage()
    return newInstance
  }

  const updateCustomInstance = (serviceId: string, instanceId: string, updates: Partial<CustomServiceInstance>) => {
    const parentService = parentServices.value.find(s => s.id === serviceId)
    if (!parentService) return null

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    // Find the instance in the parent service
    const instanceIndex = parentService.customInstances.findIndex(i => i.id === instanceId)
    if (instanceIndex === -1) return null

    const instances = parentService.customInstances
    const updatedInstance = {
      ...instances[instanceIndex],
      ...updates,
      id: instanceId // Ensure ID can't be changed
    }

    // If this is being set as default, unset any existing default
    if (updates.isDefault) {
      instances.forEach((i, idx) => {
        if (i.id !== instanceId) {
          instances[idx].isDefault = false
        }
      })
    }

    instances[instanceIndex] = updatedInstance

    saveToLocalStorage()
    return updatedInstance
  }

  const removeCustomInstance = (serviceId: string, instanceId: string) => {
    const parentService = parentServices.value.find(s => s.id === serviceId)
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

    // Remove the instance from the selection so it disappears from the details page
    const selIndex = selectedServiceIds.value.indexOf(`${serviceId}-${instanceId}`)
    if (selIndex !== -1) {
      selectedServiceIds.value.splice(selIndex, 1)
    }

    // If we removed the default and there are other instances, make the first one default
    if (wasDefault && !wasLastInstance && parentService.customInstances.length > 0) {
      parentService.customInstances[0].isDefault = true
    }

    saveToLocalStorage()
    return true
  }

  const getDefaultInstance = (serviceId: string): CustomServiceInstance | null => {
    const parentService = parentServices.value.find(s => s.id === serviceId)
    if (!parentService) return null

    // Ensure customInstances is initialized
    if (!parentService.customInstances) {
      parentService.customInstances = []
    }

    return parentService.customInstances.find(i => i.isDefault) || parentService.customInstances[0] || null
  }

  const clearStoredCredentials = () => {
    let cleared = 0
    parentServices.value.forEach(service => {
      service.customInstances?.forEach(instance => {
        if (instance.apiKey || instance.username || instance.password) cleared++
        delete instance.apiKey
        delete instance.username
        delete instance.password
      })
    })
    saveToLocalStorage()
    return cleared
  }

  return {
    parentServices,
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
    installedAppsLoading,
    preselectInstalledApps,
    loadFromLocalStorage,
    hasSelectedServices,
    initStore,
    getInstancesForService,
    // Custom instance methods
    addCustomInstance,
    updateCustomInstance,
    removeCustomInstance,
    getDefaultInstance,
    clearStoredCredentials
  }
})
