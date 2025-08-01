<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-6">
        <button 
          @click="$router.back()"
          class="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Custom Service Instances</h2>
        
        <div v-for="service in servicesWithCustomInstances" :key="service.id" class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium flex items-center">
              <img :src="service.icon" class="w-6 h-6 rounded mr-2" :alt="service.name" />
              {{ service.name }}
            </h3>
            <button 
              @click="toggleServiceInstances(service.id)"
              class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {{ expandedService === service.id ? 'Hide' : 'Show' }} instances
            </button>
          </div>

          <div v-if="expandedService === service.id" class="pl-2 border-l-2 border-gray-700">
            <div v-if="service.customInstances?.length" class="mb-4 space-y-2">
              <div 
                v-for="instance in service.customInstances" 
                :key="instance.id"
                class="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div class="font-medium">{{ instance.name }}</div>
                  <div class="text-sm text-gray-400">{{ instance.baseUrl }}</div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editInstance(service, instance)"
                    class="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    aria-label="Edit instance"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDeleteInstance(service, instance)"
                    class="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Delete instance"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <button
              @click="addNewInstance(service)"
              class="mt-2 flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add {{ service.name }} instance
            </button>
          </div>
        </div>

        <div v-if="!servicesWithCustomInstances.length" class="text-center py-6 text-gray-400">
          No services with custom instances support found.
        </div>
      </div>
    </div>

    <!-- Add/Edit Instance Modal -->
    <div v-if="showInstanceModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingInstance ? 'Edit' : 'Add' }} {{ currentService?.name }} Instance
        </h3>
        
        <form @submit.prevent="saveInstance">
          <div class="space-y-4">
            <div>
              <label for="instanceName" class="block text-sm font-medium text-gray-300 mb-1">
                Instance Name
              </label>
              <input
                id="instanceName"
                v-model="instanceForm.name"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., My Jellyfin Server"
              />
            </div>
            
            <div>
              <label for="baseUrl" class="block text-sm font-medium text-gray-300 mb-1">
                Base URL
              </label>
              <input
                id="baseUrl"
                v-model="instanceForm.baseUrl"
                type="url"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="currentService?.id === 'kodi' ? 'e.g., 192.168.1.100:8080' : 'e.g., https://jellyfin.example.com'"
              >
              <p class="mt-1 text-xs text-gray-400">
                {{ currentService?.id === 'kodi' 
                  ? 'Enter the IP and port of your Kodi instance' 
                  : 'Enter the full URL including http:// or https://' }}
              </p>
            </div>

            <div v-if="currentService?.id === 'jellyfin' || currentService?.id === 'plex'">
              <label for="apiKey" class="block text-sm font-medium text-gray-300 mb-1">
                API Key (Optional)
              </label>
              <input
                id="apiKey"
                v-model="instanceForm.apiKey"
                type="password"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty if not needed"
              >
            </div>

            <div class="flex items-center">
              <input
                id="isDefault"
                v-model="instanceForm.isDefault"
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
              >
              <label for="isDefault" class="ml-2 block text-sm text-gray-300">
                Set as default instance
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showInstanceModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ editingInstance ? 'Update' : 'Add' }} Instance
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <h3 class="text-xl font-semibold mb-4">Delete Instance</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete the instance "{{ instanceToDelete?.instance.name }}"?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteInstance"
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import type { Service, CustomServiceInstance } from '@/types'

const servicesStore = useServicesStore()
// Router is imported but not used directly in the template
// Keeping it for potential future use
const _router = useRouter()

const expandedService = ref<string | null>(null)
const showInstanceModal = ref(false)
const showDeleteModal = ref(false)
const editingInstance = ref<CustomServiceInstance | null>(null)
const instanceToDelete = ref<{ serviceId: string; instance: CustomServiceInstance } | null>(null)

const instanceForm = ref({
  name: '',
  baseUrl: '',
  apiKey: '',
  isDefault: false
})

const currentService = ref<Service | null>(null)

const servicesWithCustomInstances = computed(() => {
  return servicesStore.availableServices.filter(
    service => service.supportsCustomInstances
  )
})

onMounted(() => {
  // Expand the first service with custom instances if any
  if (servicesWithCustomInstances.value.length > 0) {
    expandedService.value = servicesWithCustomInstances.value[0].id
  }
})

function toggleServiceInstances(serviceId: string) {
  expandedService.value = expandedService.value === serviceId ? null : serviceId
}

function addNewInstance(service: Service) {
  currentService.value = service
  editingInstance.value = null
  instanceForm.value = {
    name: '',
    baseUrl: '',
    apiKey: '',
    isDefault: service.customInstances?.length === 0 // First instance is default
  }
  showInstanceModal.value = true
}

function editInstance(service: Service, instance: CustomServiceInstance) {
  currentService.value = service
  editingInstance.value = instance
  instanceForm.value = {
    name: instance.name,
    baseUrl: instance.baseUrl,
    apiKey: instance.apiKey || '',
    isDefault: instance.isDefault || false
  }
  showInstanceModal.value = true
}

function saveInstance() {
  if (!currentService.value) return

  const instanceData = {
    name: instanceForm.value.name,
    baseUrl: instanceForm.value.baseUrl,
    apiKey: instanceForm.value.apiKey || undefined,
    isDefault: instanceForm.value.isDefault
  }

  if (editingInstance.value) {
    // Update existing instance
    servicesStore.updateCustomInstance(
      currentService.value.id,
      editingInstance.value.id,
      instanceData
    )
  } else {
    // Add new instance
    servicesStore.addCustomInstance(currentService.value.id, instanceData)
  }

  showInstanceModal.value = false
}

function confirmDeleteInstance(service: Service, instance: CustomServiceInstance) {
  instanceToDelete.value = { serviceId: service.id, instance }
  showDeleteModal.value = true
}

function deleteInstance() {
  if (!instanceToDelete.value) return
  
  servicesStore.removeCustomInstance(
    instanceToDelete.value.serviceId,
    instanceToDelete.value.instance.id
  )
  
  showDeleteModal.value = false
  instanceToDelete.value = null
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
