<template>
  <div class="ui-page">
    <AppHeader back @back="$router.back()">
      <span class="hidden sm:inline text-xs text-subtle">Make it yours</span>
    </AppHeader>
    <main class="ui-container settings-content">
      <div class="ui-page-intro">
        <h1 class="ui-title">Settings</h1>
        <p class="ui-description">
          Your connections, your preferences, your MediaHub.
        </p>
      </div>
      <InstanceCockpit
        :instances="cockpitInstances"
        :services="servicesWithCustomInstances"
        :health-results="healthResults"
        :testing-ids="testingIds"
        :testing-all="testingAll"
        :is-pro="isPro"
        :is-service-installed="servicesStore.isServiceInstalled"
        @test-all="testAllInstances"
        @test-instance="testInstance"
        @toggle-instance="toggleCockpitInstance"
        @add-instance="addNewInstance"
        @edit-instance="editCockpitInstance"
        @delete-instance="deleteCockpitInstance"
      />

      <!-- Subscription Section -->
      <div class="ui-panel ui-panel-padding mb-6">
        <h2 class="ui-section-title mb-4">Subscription</h2>

        <template v-if="nativePurchases">
          <!-- Subscription Status -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <div
                class="w-3 h-3 rounded-full mr-2"
                :class="isPro ? 'bg-success' : 'bg-danger'"
              ></div>
              <span class="text-lg font-medium">
                {{ isPro ? "You're subscribed" : "Not subscribed" }}
              </span>
            </div>
            <p v-if="isPro" class="text-muted">
              Your subscription is active and you have access to all features.
            </p>
            <p v-else class="text-muted">
              Subscribe to unlock unlimited services and custom instances.
            </p>
          </div>

          <!-- Product Details -->
          <div
            v-if="
              currentOffering && currentOffering.availablePackages.length > 0
            "
            class="bg-raised rounded-lg p-4 mb-4"
          >
            <h3 class="text-lg font-medium mb-2">
              {{ currentOffering.serverDescription }}
            </h3>
            <ul
              v-if="features.length"
              class="text-sm text-muted mb-3 space-y-1"
            >
              <li v-for="feature in features" :key="feature">
                • {{ feature }}
              </li>
            </ul>
            <div v-for="p in currentOffering.availablePackages" :key="p.id">
              <p class="text-muted mb-2">
                {{ p.product.description }}
              </p>

              <p class="text-xl font-bold text-ink">
                {{ p.product.priceString }}
              </p>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-else-if="loadingOfferings"
            class="bg-raised rounded-lg p-4 mb-4"
          >
            <div class="flex items-center justify-center">
              <svg
                class="animate-spin h-6 w-6 text-muted"
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
              <span class="ml-2 text-muted">
                Loading subscription details...
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="offeringsError"
            class="mb-4 p-3 bg-danger-soft/50 border border-danger rounded-lg"
          >
            <p class="text-danger text-sm">{{ offeringsError }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <button
              v-if="!isPro"
              @click="handlePurchase"
              :disabled="loadingOfferings || purchaseLoading || restoreLoading || !currentOffering"
              class="ui-button ui-button--primary flex-1"
            >
              <span
                v-if="purchaseLoading"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
              :disabled="restoreLoading || purchaseLoading"
              class="ui-button"
            >
              <span
                v-if="restoreLoading"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
        </template>
        <p v-else class="ui-description">
          Subscriptions and purchase restoration are available in the MediaHub
          mobile app.
        </p>
      </div>

      <!-- Contact Support Section -->
      <div class="ui-panel ui-panel-padding mb-6">
        <h2 class="ui-section-title mb-2">Contact Support</h2>
        <p class="text-muted mb-4">
          Need help? Send us an email and we'll get back to you.
        </p>
        <button @click="contactSupport" class="ui-button ui-button--primary">
          Contact Support
        </button>
      </div>
    </main>

    <!-- Add/Edit Instance Modal -->
    <AppDialog
      v-if="showInstanceModal"
      :labelled-by="`${editingInstance ? 'edit' : 'add'}-instance-title`"
      @close="showInstanceModal = false"
    >
      <div class="flex items-center mb-4">
        <img
          v-if="currentService"
          :src="currentService.icon"
          class="w-8 h-8 rounded mr-3 object-contain"
          :alt="`${currentService.name} icon`"
        />
        <h3
          :id="`${editingInstance ? 'edit' : 'add'}-instance-title`"
          class="ui-section-title"
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
              class="block text-sm font-medium text-muted mb-1"
            >
              Instance Name
            </label>
            <input
              id="instanceName"
              v-model="instanceForm.name"
              type="text"
              required
              class="ui-input"
              placeholder="e.g., My Jellyfin Server"
              :aria-invalid="!!nameError"
              @input="validateName"
            />
            <p v-if="nameError" class="mt-1 text-xs text-danger">
              {{ nameError }}
            </p>
          </div>

          <div>
            <label
              for="baseUrl"
              class="block text-sm font-medium text-muted mb-1"
            >
              Base URL
            </label>
            <input
              id="baseUrl"
              v-model="instanceForm.baseUrl"
              :type="currentService?.id === 'kodi' ? 'text' : 'url'"
              required
              class="ui-input"
              :placeholder="getUrlPlaceholder(currentService?.id)"
              :aria-invalid="!!urlError"
              @input="validateUrl"
            />
            <p class="mt-1 text-xs text-muted">
              {{ getUrlHelpText(currentService?.id) }}
            </p>
            <p v-if="urlError" class="mt-1 text-xs text-danger">
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
              class="block text-sm font-medium text-muted mb-1"
            >
              API Key (Optional)
            </label>
            <input
              id="apiKey"
              v-model="instanceForm.apiKey"
              type="password"
              class="ui-input"
              placeholder="Leave empty if not needed"
            />
          </div>

          <div class="flex items-center">
            <input
              id="isDefault"
              v-model="instanceForm.isDefault"
              type="checkbox"
              class="h-4 w-4 text-accent rounded border-line bg-raised focus:ring-accent"
              @change="handleDefaultChange"
            />
            <label for="isDefault" class="ml-2 block text-sm text-muted">
              Set as default instance
            </label>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            @click="showInstanceModal = false"
            class="ui-button ui-button--ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="ui-button ui-button--primary"
            :disabled="!!nameError || !!urlError || isSaving"
          >
            <span v-if="isSaving" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
    </AppDialog>

    <!-- Delete Confirmation Modal -->
    <AppDialog
      v-if="showDeleteModal"
      labelled-by="delete-instance-title"
      @close="showDeleteModal = false"
    >
      <h3 id="delete-instance-title" class="ui-section-title mb-4">
        Delete Instance
      </h3>
      <p class="text-muted mb-6">
        Are you sure you want to delete the instance "{{
          instanceToDelete?.instance.name
        }}"?
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteModal = false"
          class="ui-button ui-button--ghost"
        >
          Cancel
        </button>
        <button
          @click="deleteInstance"
          class="ui-button ui-button--danger"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
          <span v-else>Delete</span>
        </button>
      </div>
    </AppDialog>

    <!-- Default Instance Confirmation Modal -->
    <AppDialog
      v-if="showDefaultConfirmModal"
      labelled-by="default-instance-title"
      @close="showDefaultConfirmModal = false"
    >
      <h3 id="default-instance-title" class="ui-section-title mb-4">
        Change Default Instance
      </h3>
      <p class="text-muted mb-6">
        Are you sure you want to set "{{ instanceForm.name }}" as the default
        instance? This will replace the current default instance.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDefaultConfirmModal = false"
          class="ui-button ui-button--ghost"
        >
          Cancel
        </button>
        <button
          @click="confirmDefaultChange"
          class="ui-button ui-button--primary"
        >
          Confirm
        </button>
      </div>
    </AppDialog>
    <div class="h-safe-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import AppHeader from "@/components/AppHeader.vue";
import InstanceCockpit from "@/components/InstanceCockpit.vue";
import { useServicesStore } from "@/stores/services";
import type { Service, CustomServiceInstance, InstanceCheckResult } from "@/types";
import { hasPro } from "@/composables/products";
import { Device } from "@capacitor/device";
import { Capacitor } from "@capacitor/core";
import { getPurchases } from "@/utils/purchases";
import {
  RevenueCatUI,
  PAYWALL_RESULT,
} from "@revenuecat/purchases-capacitor-ui";

const nativePurchases = Capacitor.getPlatform() !== "web";
const servicesStore = useServicesStore();

const showInstanceModal = ref(false);
const showDeleteModal = ref(false);
const showDefaultConfirmModal = ref(false);
const editingInstance = ref<CustomServiceInstance | null>(null);
const instanceToDelete = ref<{
  serviceId: string;
  instance: CustomServiceInstance;
} | null>(null);
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
  getInstancesForService(service.id).map(instance => ({
    service,
    instance,
    selected: servicesStore.isServiceSelected(`${service.id}-${instance.id}`),
  }))
));

function toggleCockpitInstance(entry: { service: Service; instance: CustomServiceInstance }) {
  servicesStore.toggleService(`${entry.service.id}-${entry.instance.id}`);
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

const fetchOfferings = async () => {
  loadingOfferings.value = true;
  offeringsError.value = null;
  try {
    const offerings = await (await getPurchases()).getOfferings();
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
  if (!nativePurchases) return;

  // Fetch customer ID and entitlements for display
  try {
    const { customerInfo } = await (await getPurchases()).getCustomerInfo();
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

function editCockpitInstance(entry: { service: Service; instance: CustomServiceInstance }) {
  editInstance(entry.service, entry.instance);
}

function deleteCockpitInstance(entry: { service: Service; instance: CustomServiceInstance }) {
  confirmDeleteInstance(entry.service, entry.instance);
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
  offeringsError.value = null;
  try {
    await getPurchases();
    // Present paywall for current offering:
    const { result } = await RevenueCatUI.presentPaywall();

    // Handle result if needed.
    switch (result) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
        offeringsError.value = "Could not open the purchase screen. Please try again.";
        return false;
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
  } catch (error) {
    console.error("Could not open the purchase screen:", error);
    offeringsError.value = "Could not open the purchase screen. Please try again.";
  } finally {
    purchaseLoading.value = false;
  }
};

const handleRestorePurchases = async () => {
  restoreLoading.value = true;
  try {
    const { customerInfo } = await (await getPurchases()).restorePurchases();
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
  let body: string;
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
.settings-content {
  padding-bottom: 16px;
}
</style>
