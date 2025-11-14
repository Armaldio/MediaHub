<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-6">
        <button
          @click="$router.back()"
          class="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Custom Service Instances</h2>

        <!-- Search functionality -->
        <div class="mb-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search services..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search services"
          />
        </div>

        <div v-for="service in filteredServices" :key="service.id" class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium flex items-center">
              <img
                :src="service.icon"
                class="w-6 h-6 rounded mr-2"
                :alt="`${service.name} icon`"
              />
              {{ service.name }}
            </h3>
            <button
              @click="toggleServiceInstances(service.id)"
              class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              :aria-expanded="expandedService === service.id"
              :aria-controls="`service-instances-${service.id}`"
            >
              {{ expandedService === service.id ? "Hide" : "Show" }} instances
            </button>
          </div>

          <div
            v-if="expandedService === service.id"
            :id="`service-instances-${service.id}`"
            class="pl-2 border-l-2 border-gray-700"
          >
            <div
              v-if="getInstancesForService(service.id).length"
              class="mb-4 space-y-2"
            >
              <div
                v-for="instance in getInstancesForService(service.id)"
                :key="instance.id"
                class="bg-gray-700 rounded-lg p-4 flex justify-between items-center relative group"
                :class="{ 'border-2 border-blue-500': instance.isDefault }"
                role="listitem"
                :aria-label="`${instance.name} instance`"
              >
                <div>
                  <div class="font-medium">{{ instance.name }}</div>
                  <div class="text-sm text-gray-400">
                    {{ instance.baseUrl }}
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="editInstance(service, instance)"
                    class="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    aria-label="Edit instance"
                    :title="`Edit ${instance.name}`"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="confirmDeleteInstance(service, instance)"
                    class="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Delete instance"
                    :title="`Delete ${instance.name}`"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <!-- Default instance badge -->
                <div
                  v-if="instance.isDefault"
                  class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full"
                >
                  Default
                </div>
              </div>
            </div>

            <button
              @click="addNewInstance(service)"
              :disabled="!isPro"
              class="mt-2 flex items-center text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-sm"
              :aria-label="`Add ${service.name} instance`"
              :title="
                !isPro
                  ? 'Subscription required to add custom instances'
                  : `Add ${service.name} instance`
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add {{ service.name }} instance
            </button>
          </div>
        </div>

        <div
          v-if="!filteredServices.length"
          class="text-center py-6 text-gray-400"
        >
          No services with custom instances support found.
        </div>
      </div>

      <!-- Subscription Section -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Subscription</h2>

        <!-- Subscription Status -->
        <div class="mb-4">
          <div class="flex items-center mb-2">
            <div
              class="w-3 h-3 rounded-full mr-2"
              :class="isPro ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="text-lg font-medium">
              {{ isPro ? "Active Subscription" : "No Active Subscription" }}
            </span>
          </div>
          <p v-if="isPro" class="text-gray-400">
            Your subscription is active and you have access to all features.
          </p>
          <p v-else class="text-gray-400">
            Subscribe to unlock unlimited services and custom instances.
          </p>
        </div>

        <!-- Product Details -->
        <div class="bg-gray-700 rounded-lg p-4 mb-4">
          <h3 class="text-lg font-medium mb-2">Basic Subscription</h3>
          <p class="text-gray-300 mb-2">Unlock all features:</p>
          <ul class="text-sm text-gray-400 mb-3 space-y-1">
            <li>• Unlimited service selection</li>
            <li>• Custom service instances</li>
            <li>• Priority support</li>
          </ul>
          <p class="text-xl font-bold text-white">4.99€</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="false"
          class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg"
        >
          <p class="text-red-400 text-sm">{{ false }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            v-if="!isPro"
            @click="handlePurchase"
            :disabled="false"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="false" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
            <span v-else>Purchase Subscription</span>
          </button>

          <button
            @click="handleRestorePurchases"
            :disabled="false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="false" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Restoring...
            </span>
            <span v-else>Restore Purchases</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Instance Modal -->
    <div
      v-if="showInstanceModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`${editingInstance ? 'edit' : 'add'}-instance-title`"
    >
      <div class="bg-gray-800 rounded-lg w-full max-w-md p-6" role="document">
        <div class="flex items-center mb-4">
          <img
            v-if="currentService"
            :src="currentService.icon"
            class="w-8 h-8 rounded mr-3"
            :alt="`${currentService.name} icon`"
          />
          <h3
            :id="`${editingInstance ? 'edit' : 'add'}-instance-title`"
            class="text-xl font-semibold"
          >
            {{ editingInstance ? "Edit" : "Add" }}
            {{ currentService?.name }} Instance
          </h3>
        </div>

        <form @submit.prevent="saveInstance" :aria-busy="isSaving">
          <div class="space-y-4">
            <div>
              <label
                for="instanceName"
                class="block text-sm font-medium text-gray-300 mb-1"
              >
                Instance Name
              </label>
              <input
                id="instanceName"
                v-model="instanceForm.name"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., My Jellyfin Server"
                :aria-invalid="!!nameError"
                @input="validateName"
              />
              <p v-if="nameError" class="mt-1 text-xs text-red-400">
                {{ nameError }}
              </p>
            </div>

            <div>
              <label
                for="baseUrl"
                class="block text-sm font-medium text-gray-300 mb-1"
              >
                Base URL
              </label>
              <input
                id="baseUrl"
                v-model="instanceForm.baseUrl"
                :type="currentService?.id === 'kodi' ? 'text' : 'url'"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="getUrlPlaceholder(currentService?.id)"
                :aria-invalid="!!urlError"
                @input="validateUrl"
              />
              <p class="mt-1 text-xs text-gray-400">
                {{ getUrlHelpText(currentService?.id) }}
              </p>
              <p v-if="urlError" class="mt-1 text-xs text-red-400">
                {{ urlError }}
              </p>
            </div>

            <div
              v-if="
                currentService?.id === 'jellyfin' ||
                currentService?.id === 'plex'
              "
            >
              <label
                for="apiKey"
                class="block text-sm font-medium text-gray-300 mb-1"
              >
                API Key (Optional)
              </label>
              <input
                id="apiKey"
                v-model="instanceForm.apiKey"
                type="password"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty if not needed"
              />
            </div>

            <div class="flex items-center">
              <input
                id="isDefault"
                v-model="instanceForm.isDefault"
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                @change="handleDefaultChange"
              />
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
              :disabled="!!nameError || !!urlError || isSaving"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
              <span v-else>
                {{ editingInstance ? "Update" : "Add" }} Instance
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-instance-title"
    >
      <div class="bg-gray-800 rounded-lg w-full max-w-md p-6" role="document">
        <h3 id="delete-instance-title" class="text-xl font-semibold mb-4">
          Delete Instance
        </h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete the instance "{{
            instanceToDelete?.instance.name
          }}"?
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
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </span>
            <span v-else> Delete </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Default Instance Confirmation Modal -->
    <div
      v-if="showDefaultConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="default-instance-title"
    >
      <div class="bg-gray-800 rounded-lg w-full max-w-md p-6" role="document">
        <h3 id="default-instance-title" class="text-xl font-semibold mb-4">
          Change Default Instance
        </h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to set "{{ instanceForm.name }}" as the default
          instance? This will replace the current default instance.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDefaultConfirmModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDefaultChange"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useServicesStore } from "@/stores/services";
import { v4 as uuidv4 } from "uuid";
import type { Service, CustomServiceInstance } from "@/types";
import { useProducts } from "@/composables/products";
import { Purchases } from "@revenuecat/purchases-capacitor";
import {
  RevenueCatUI,
  PAYWALL_RESULT,
} from "@revenuecat/purchases-capacitor-ui";

const servicesStore = useServicesStore();
const { hasPro } = useProducts();

const expandedService = ref<string | null>(null);
const showInstanceModal = ref(false);
const showDeleteModal = ref(false);
const showDefaultConfirmModal = ref(false);
const editingInstance = ref<CustomServiceInstance | null>(null);
const instanceToDelete = ref<{
  serviceId: string;
  instance: CustomServiceInstance;
} | null>(null);
const searchQuery = ref("");
const nameError = ref<string | null>(null);
const urlError = ref<string | null>(null);
const pendingDefaultChange = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const userCustomInstances = ref<Record<string, CustomServiceInstance[]>>({});

const isPro = ref(false);

const instanceForm = ref({
  name: "",
  baseUrl: "",
  apiKey: "",
  isDefault: false,
});

const currentService = ref<Service | null>(null);

const USER_CUSTOM_INSTANCES_KEY = "userCustomInstances";

// Load user instances from localStorage
const loadUserInstances = () => {
  try {
    const stored = localStorage.getItem(USER_CUSTOM_INSTANCES_KEY);
    if (stored) {
      userCustomInstances.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading user instances from localStorage:", error);
  }
};

// Save user instances to localStorage
const saveUserInstances = () => {
  try {
    localStorage.setItem(
      USER_CUSTOM_INSTANCES_KEY,
      JSON.stringify(userCustomInstances.value)
    );
  } catch (error) {
    console.error("Error saving user instances to localStorage:", error);
  }
};

const servicesWithCustomInstances = computed(() => {
  return servicesStore.availableServices.filter(
    (service) => service.supportsCustomInstances && !("isInstance" in service)
  );
});

const getInstancesForService = (serviceId: string) => {
  // Use userCustomInstances instead of servicesStore
  return userCustomInstances.value[serviceId] || [];
};

const filteredServices = computed(() => {
  if (!searchQuery.value) return servicesWithCustomInstances.value;
  const query = searchQuery.value.toLowerCase();
  return servicesWithCustomInstances.value.filter((service) =>
    service.name.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  // Load user instances from localStorage
  loadUserInstances();

  // Expand the first service with custom instances if any
  if (servicesWithCustomInstances.value.length > 0) {
    expandedService.value = servicesWithCustomInstances.value[0].id;
  }

  isPro.value = await hasPro();
});

function toggleServiceInstances(serviceId: string) {
  expandedService.value =
    expandedService.value === serviceId ? null : serviceId;
}

function addNewInstance(service: Service) {
  currentService.value = service;
  editingInstance.value = null;
  const instances = getInstancesForService(service.id);
  instanceForm.value = {
    name: "",
    baseUrl: "",
    apiKey: "",
    isDefault: instances.length === 0, // First instance is default
  };
  resetValidation();
  showInstanceModal.value = true;
}

function editInstance(service: Service, instance: CustomServiceInstance) {
  currentService.value = service;
  editingInstance.value = instance;
  instanceForm.value = {
    name: instance.name,
    baseUrl: instance.baseUrl,
    apiKey: instance.apiKey || "",
    isDefault: instance.isDefault || false,
  };
  resetValidation();
  showInstanceModal.value = true;
}

function validateName() {
  nameError.value = null;
  if (!instanceForm.value.name.trim()) {
    nameError.value = "Instance name is required";
  }
}

function validateUrl() {
  urlError.value = null;
  if (!instanceForm.value.baseUrl.trim()) {
    urlError.value = "Base URL is required";
    return;
  }

  if (currentService.value?.id === "kodi") {
    // For Kodi, validate IP:port format
    const kodiPattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    if (!kodiPattern.test(instanceForm.value.baseUrl)) {
      urlError.value =
        "Kodi URL should be in format: IP:port (e.g., 192.168.1.100:8080)";
    }
  } else {
    // For other services, validate URL format
    try {
      new URL(instanceForm.value.baseUrl);
    } catch {
      urlError.value = "Please enter a valid URL including http:// or https://";
    }
  }
}

function getUrlPlaceholder(serviceId?: string) {
  if (!serviceId) return "Enter URL or IP:port";
  if (serviceId === "kodi") return "e.g., 192.168.1.100:8080";
  return "e.g., https://jellyfin.example.com";
}

function getUrlHelpText(serviceId?: string) {
  if (!serviceId) return "Enter the URL or IP:port of your service instance";
  if (serviceId === "kodi")
    return "Enter the IP and port of your Kodi instance";
  return "Enter the full URL including http:// or https://";
}

function handleDefaultChange() {
  if (instanceForm.value.isDefault) {
    // Show confirmation modal if setting as default
    showDefaultConfirmModal.value = true;
    pendingDefaultChange.value = true;
    instanceForm.value.isDefault = false; // Temporarily revert until confirmed
  }
}

function confirmDefaultChange() {
  instanceForm.value.isDefault = true;
  showDefaultConfirmModal.value = false;
  pendingDefaultChange.value = false;
}

function resetValidation() {
  nameError.value = null;
  urlError.value = null;
}

async function saveInstance() {
  validateName();
  validateUrl();

  if (nameError.value || urlError.value) return;
  if (!currentService.value) return;

  isSaving.value = true;

  try {
    const instanceData = {
      id: editingInstance.value?.id || uuidv4(),
      name: instanceForm.value.name,
      baseUrl: instanceForm.value.baseUrl,
      apiKey: instanceForm.value.apiKey || undefined,
      isDefault: instanceForm.value.isDefault,
    };

    // Update userCustomInstances
    if (!userCustomInstances.value[currentService.value.id]) {
      userCustomInstances.value[currentService.value.id] = [];
    }

    if (editingInstance.value) {
      // Update existing instance
      const index = userCustomInstances.value[
        currentService.value.id
      ].findIndex((i) => i.id === editingInstance.value?.id);
      if (index !== -1) {
        userCustomInstances.value[currentService.value.id][index] =
          instanceData;
      }
    } else {
      // Add new instance
      userCustomInstances.value[currentService.value.id].push(instanceData);
    }

    // Save to localStorage
    saveUserInstances();

    // Also update the services store
    if (editingInstance.value) {
      await servicesStore.updateCustomInstance(
        currentService.value.id,
        editingInstance.value.id,
        instanceData
      );
    } else {
      await servicesStore.addCustomInstance(
        currentService.value.id,
        instanceData
      );
    }

    showInstanceModal.value = false;
  } catch (error) {
    console.error("Error saving instance:", error);
    // Handle error (could show a toast notification)
  } finally {
    isSaving.value = false;
  }
}

function confirmDeleteInstance(
  service: Service,
  instance: CustomServiceInstance
) {
  instanceToDelete.value = { serviceId: service.id, instance };
  showDeleteModal.value = true;
}

async function deleteInstance() {
  if (!instanceToDelete.value) return;

  isDeleting.value = true;

  try {
    // Update userCustomInstances
    if (userCustomInstances.value[instanceToDelete.value.serviceId]) {
      userCustomInstances.value[instanceToDelete.value.serviceId] =
        userCustomInstances.value[instanceToDelete.value.serviceId].filter(
          (i) => i.id !== instanceToDelete.value?.instance.id
        );
    }

    // Save to localStorage
    saveUserInstances();

    // Also update the services store
    await servicesStore.removeCustomInstance(
      instanceToDelete.value.serviceId,
      instanceToDelete.value.instance.id
    );

    showDeleteModal.value = false;
    instanceToDelete.value = null;
  } catch (error) {
    console.error("Error deleting instance:", error);
    // Handle error (could show a toast notification)
  } finally {
    isDeleting.value = false;
  }
}

const handlePurchase = async () => {
  // Present paywall for current offering:
  const { result } = await RevenueCatUI.presentPaywall();

  // Handle result if needed.
  switch (result) {
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
    case PAYWALL_RESULT.CANCELLED:
      return false;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      return true;
    default:
      return false;
  }
};

const handleRestorePurchases = async () => {
  try {
    await Purchases.restorePurchases();
  } catch (error) {
    console.error("Error restoring purchases:", error);
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
