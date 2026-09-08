<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="h-safe-top"></div>
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
          </div>

          <div
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

      <!-- Instance Cockpit -->
      <section class="bg-gray-800 rounded-lg p-6 mb-6" aria-labelledby="cockpit-title">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="cockpit-title" class="text-xl font-semibold">Instance Cockpit</h2>
            <p class="mt-1 text-sm text-gray-400">
              Check connectivity, authentication, and available capabilities for your configured instances.
            </p>
          </div>
          <button
            v-if="cockpitInstances.length"
            @click="testAllInstances"
            :disabled="testingAll"
            class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ testingAll ? "Testing all…" : "Test all" }}
          </button>
        </div>

        <div v-if="!cockpitInstances.length" class="mt-6 rounded-lg border border-dashed border-gray-600 p-6 text-center text-sm text-gray-400">
          Add a custom instance above to start checking your media services.
        </div>

        <div v-else class="mt-6 space-y-3">
          <article
            v-for="entry in cockpitInstances"
            :key="entry.instance.id"
            class="rounded-lg border border-gray-700 bg-gray-700/60 p-4"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <img :src="entry.service.icon" class="h-8 w-8 rounded" :alt="`${entry.service.name} icon`" />
                  <div>
                    <h3 class="font-medium">{{ entry.instance.name }}</h3>
                    <p class="text-xs text-gray-400">{{ entry.service.name }} · {{ entry.instance.isDefault ? "Default instance" : "Additional instance" }}</p>
                  </div>
                </div>
                <p class="mt-3 break-all font-mono text-xs text-gray-400">{{ normalizedUrl(entry.instance, entry.service.id) }}</p>

                <div class="mt-3 flex flex-wrap gap-2 text-xs">
                  <span v-for="capability in capabilitiesFor(entry)" :key="capability" class="rounded-full bg-gray-600 px-2 py-1 text-gray-200">{{ capability }}</span>
                  <span class="rounded-full bg-gray-600 px-2 py-1 text-gray-300">{{ servicesStore.isServiceInstalled(entry.service) ? "Native app installed" : "Native app missing" }}</span>
                </div>
              </div>

              <div class="flex min-w-[220px] flex-col items-start gap-2 lg:items-end">
                <span class="rounded-full px-3 py-1 text-sm font-medium" :class="statusClass(statusFor(entry))">
                  {{ statusLabel(statusFor(entry)) }}
                </span>
                <p class="text-right text-xs text-gray-400">{{ detailFor(entry) }}</p>
                <p v-if="healthFor(entry)?.httpStatus" class="text-xs text-gray-500">HTTP {{ healthFor(entry)?.httpStatus }}</p>
                <button
                  @click="testInstance(entry)"
                  :disabled="testingIds.has(entry.instance.id)"
                  class="rounded-md border border-gray-500 px-3 py-1.5 text-sm text-blue-300 hover:border-blue-400 hover:text-blue-200 disabled:cursor-wait disabled:opacity-50"
                >
                  {{ testingIds.has(entry.instance.id) ? "Testing…" : healthFor(entry) ? "Test again" : "Test connection" }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-6 border-t border-gray-700 pt-4">
          <p class="text-sm text-amber-200">API keys and passwords are currently stored in this browser/device's local storage.</p>
          <button @click="clearCredentials" class="mt-3 rounded-md border border-red-700 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/30">Clear locally stored credentials</button>
        </div>
      </section>

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
              {{ isPro ? "You're subscribed" : "Not subscribed" }}
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
        <div
          v-if="currentOffering && currentOffering.availablePackages.length > 0"
          class="bg-gray-700 rounded-lg p-4 mb-4"
        >
          <h3 class="text-lg font-medium mb-2">
            {{ currentOffering.serverDescription }}
          </h3>
          <ul v-if="features.length" class="text-sm text-gray-400 mb-3 space-y-1">
            <li v-for="feature in features" :key="feature">• {{ feature }}</li>
          </ul>
          <div v-for="p in currentOffering.availablePackages" :key="p.id">
            <p class="text-gray-300 mb-2">
              {{ p.product.description }}
            </p>

            <p class="text-xl font-bold text-white">
              {{ p.product.priceString }}
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-else-if="loadingOfferings"
          class="bg-gray-700 rounded-lg p-4 mb-4"
        >
          <div class="flex items-center justify-center">
            <svg
              class="animate-spin h-6 w-6 text-gray-400"
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
            <span class="ml-2 text-gray-400"
              >Loading subscription details...</span
            >
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="offeringsError"
          class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg"
        >
          <p class="text-red-400 text-sm">{{ offeringsError }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            v-if="!isPro"
            @click="handlePurchase"
            :disabled="loadingOfferings || !currentOffering"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span
              v-if="purchaseLoading"
              class="flex items-center justify-center"
            >
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
            :disabled="restoreLoading"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span
              v-if="restoreLoading"
              class="flex items-center justify-center"
            >
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

      <!-- Contact Support Section -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-2">Contact Support</h2>
        <p class="text-gray-400 mb-4">
          Need help? Send us an email and we'll get back to you.
        </p>
        <button
          @click="contactSupport"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>

    <!-- Add/Edit Instance Modal -->
    <div
      v-if="showInstanceModal"
      class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
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
                currentService?.id === 'plex' ||
                currentService?.id === 'seerr' ||
                currentService?.id === 'sonarr' ||
                currentService?.id === 'radarr'
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
      class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
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
      class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
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
    <div class="h-safe-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useServicesStore } from "@/stores/services";
import type { Service, CustomServiceInstance, InstanceCheckResult, InstanceCheckStatus } from "@/types";
import { normalizeInstanceUrl } from "@/utils/instanceHealth";
import { useProducts } from "@/composables/products";
import { Device } from "@capacitor/device";
import { Purchases } from "@revenuecat/purchases-capacitor";
import {
  RevenueCatUI,
  PAYWALL_RESULT,
} from "@revenuecat/purchases-capacitor-ui";

const servicesStore = useServicesStore();
const { hasPro } = useProducts();

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
const healthResults = ref<Record<string, InstanceCheckResult>>({});
const testingIds = ref(new Set<string>());
const testingAll = ref(false);

const isPro = ref(false);
const customerId = ref<string | null>(null);
const activeEntitlements = ref<string[]>([]);
const currentOffering = ref<any>(null);
const loadingOfferings = ref(false);
const offeringsError = ref<string | null>(null);
const purchaseLoading = ref(false);
const restoreLoading = ref(false);
const features = ref<string[]>([]);

const instanceForm = ref({
  name: "",
  baseUrl: "",
  apiKey: "",
  isDefault: false,
});

const currentService = ref<Service | null>(null);

const servicesWithCustomInstances = computed(() => {
  return servicesStore.availableServices.filter(
    (service) => service.supportsCustomInstances && !("isInstance" in service)
  );
});

const getInstancesForService = (serviceId: string) => {
  return servicesStore.getInstancesForService(serviceId);
};

const cockpitInstances = computed(() => servicesWithCustomInstances.value.flatMap(service =>
  getInstancesForService(service.id).map(instance => ({ service, instance }))
));

function healthFor(entry: { instance: CustomServiceInstance }) {
  return healthResults.value[entry.instance.id];
}

function statusFor(entry: { service: Service; instance: CustomServiceInstance }): InstanceCheckStatus {
  return healthFor(entry)?.status ?? "never_checked";
}

function statusLabel(status: InstanceCheckStatus) {
  if (status === "never_checked") return "Never checked";
  return {
    healthy: "Healthy",
    authentication_required: "Authentication failed",
    unauthorized: "Unauthorized",
    unreachable: "Unreachable",
    missing_credential: "Missing API key",
    never_checked: "Never checked",
    unsupported: "Unsupported check",
  }[status];
}

function statusClass(status: InstanceCheckStatus) {
  return {
    healthy: "bg-green-900/70 text-green-200",
    authentication_required: "bg-red-900/70 text-red-200",
    unauthorized: "bg-red-900/70 text-red-200",
    unreachable: "bg-orange-900/70 text-orange-200",
    missing_credential: "bg-yellow-900/70 text-yellow-200",
    never_checked: "bg-gray-600 text-gray-200",
    unsupported: "bg-gray-600 text-gray-200",
  }[status];
}

function normalizedUrl(instance: CustomServiceInstance, serviceId: string) {
  try { return normalizeInstanceUrl(instance.baseUrl, serviceId === "kodi"); }
  catch { return instance.baseUrl || "Invalid URL"; }
}

function capabilitiesFor(entry: { service: Service; instance: CustomServiceInstance }) {
  return healthFor(entry)?.capabilities ?? ["Web interface", "API access"];
}

function detailFor(entry: { service: Service; instance: CustomServiceInstance }) {
  const health = healthFor(entry);
  if (!health) return "Not checked yet";
  return `${health.message} · ${new Date(health.checkedAt).toLocaleString()}`;
}

async function testInstance(entry: { service: Service; instance: CustomServiceInstance }) {
  if (!entry.service.testInstance) {
    healthResults.value[entry.instance.id] = {
      status: "unsupported",
      message: "This service does not provide a meaningful connection check.",
      checkedAt: new Date().toISOString(),
    };
    return;
  }
  testingIds.value = new Set(testingIds.value).add(entry.instance.id);
  try {
    healthResults.value[entry.instance.id] = await entry.service.testInstance(entry.instance);
  } catch {
    healthResults.value[entry.instance.id] = {
      status: "unreachable",
      message: "The instance check failed unexpectedly. Check the URL and server status.",
      checkedAt: new Date().toISOString(),
    };
  } finally {
    const next = new Set(testingIds.value);
    next.delete(entry.instance.id);
    testingIds.value = next;
  }
}

async function testAllInstances() {
  testingAll.value = true;
  try { await Promise.all(cockpitInstances.value.map(testInstance)); }
  finally { testingAll.value = false; }
}

function clearCredentials() {
  if (!window.confirm("Clear all locally stored API keys and passwords? This cannot be undone.")) return;
  const count = servicesStore.clearStoredCredentials();
  Object.keys(healthResults.value).forEach(id => delete healthResults.value[id]);
  alert(count ? `Cleared credentials for ${count} instance${count === 1 ? "" : "s"}.` : "No stored credentials found.");
}

const filteredServices = computed(() => {
  if (!searchQuery.value) return servicesWithCustomInstances.value;
  const query = searchQuery.value.toLowerCase();
  return servicesWithCustomInstances.value.filter((service) =>
    service.name.toLowerCase().includes(query)
  );
});

const fetchOfferings = async () => {
  loadingOfferings.value = true;
  offeringsError.value = null;
  try {
    const offerings = await Purchases.getOfferings();
    console.log("offerings", JSON.stringify(offerings, null, 2));
    currentOffering.value = offerings.current;

    if (currentOffering.value?.availablePackages?.length) {
      const pkg = currentOffering.value.availablePackages[0];
      const meta = pkg?.product?.metadata;
      const raw = meta?.features;
      if (Array.isArray(raw)) {
        features.value = raw.filter(Boolean);
      } else if (typeof raw === "string") {
        try {
          features.value = JSON.parse(raw).filter(Boolean);
        } catch {
          // ignore invalid JSON
        }
      }
    }
  } catch (error) {
    console.error("Error fetching offerings:", error);
    offeringsError.value =
      "Failed to load subscription details. Please try again.";
  } finally {
    loadingOfferings.value = false;
  }
};

onMounted(async () => {
  isPro.value = await hasPro();

  // Fetch customer ID and entitlements for display
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    customerId.value = customerInfo.originalAppUserId;
    activeEntitlements.value = Object.keys(customerInfo.entitlements.active);
  } catch (e) {
    console.error("Failed to fetch customer info:", e);
  }

  // Fetch offerings for subscription details
  await fetchOfferings();
});

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
    const instanceData: Omit<CustomServiceInstance, 'id'> = {
      name: instanceForm.value.name,
      baseUrl: instanceForm.value.baseUrl,
      apiKey: instanceForm.value.apiKey || undefined,
      isDefault: instanceForm.value.isDefault,
    };

    if (editingInstance.value) {
      await servicesStore.updateCustomInstance(
        currentService.value.id,
        editingInstance.value.id,
        instanceData
      );
      delete healthResults.value[editingInstance.value.id];
    } else {
      servicesStore.addCustomInstance(currentService.value.id, instanceData);
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
    await servicesStore.removeCustomInstance(
      instanceToDelete.value.serviceId,
      instanceToDelete.value.instance.id
    );
    delete healthResults.value[instanceToDelete.value.instance.id];

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
  purchaseLoading.value = true;
  try {
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
        // Refresh subscription status
        isPro.value = await hasPro();
        return true;
      default:
        return false;
    }
  } finally {
    purchaseLoading.value = false;
  }
};

const handleRestorePurchases = async () => {
  restoreLoading.value = true;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const restored =
      typeof customerInfo.entitlements.active["custom-instances"] !== "undefined" ||
      typeof customerInfo.entitlements.active["unlimited-services"] !== "undefined"
    isPro.value = restored;
    alert(
      restored
        ? "Subscription restored successfully!"
        : "No active subscription found for this account."
    );
  } catch (error) {
    console.error("Error restoring purchases:", error);
    alert("Failed to restore purchases. Please try again.");
  } finally {
    restoreLoading.value = false;
  }
};

const contactSupport = async () => {
  let body = "";
  try {
    const info = await Device.getInfo();
    body = `Platform: ${info.platform}\nOS: ${info.operatingSystem} ${info.osVersion}\nModel: ${info.model}`;
  } catch {
    body = `User Agent: ${navigator.userAgent}`;
  }
  const subject = encodeURIComponent("MediaHub Support");
  const mailto = `mailto:contact@armaldio.xyz?subject=${subject}&body=${encodeURIComponent(body)}`;
  window.open(mailto, "_blank");
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
