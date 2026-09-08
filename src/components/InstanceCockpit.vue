<template>
  <section class="mb-6 rounded-lg bg-gray-800 p-5 sm:p-6" aria-labelledby="cockpit-title">
    <header class="flex flex-col gap-4 border-b border-gray-700 pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Local connections</p>
        <h2 id="cockpit-title" class="mt-1 text-2xl font-semibold tracking-tight">Instance Cockpit</h2>
        <p class="mt-1 max-w-2xl text-sm text-gray-400">Test, manage, and troubleshoot your configured media services.</p>
      </div>
      <div class="flex flex-wrap gap-2 lg:justify-end">
        <button
          @click="openProviderPicker"
          :disabled="!isPro"
          :title="isPro ? 'Add an instance' : 'Subscription required to add custom instances'"
          class="rounded-lg border border-gray-500 px-3 py-2 text-sm font-medium text-gray-100 hover:border-blue-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add instance
        </button>
        <button
          v-if="instances.length"
          @click="emit('test-all')"
          :disabled="testingAll"
          class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-50"
        >
          {{ testingAll ? "Testing all…" : "Test all instances" }}
        </button>
      </div>
    </header>

    <div v-if="instances.length" class="mt-4 flex flex-wrap gap-2" aria-label="Instance health filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        @click="activeFilter = filter.id"
        :aria-pressed="activeFilter === filter.id"
        class="rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        :class="activeFilter === filter.id ? 'border-blue-400 bg-blue-500/15 text-blue-100' : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'"
      >
        {{ filter.label }} <span class="ml-1 tabular-nums text-xs opacity-75">{{ filter.count }}</span>
      </button>
      <p class="self-center text-xs text-gray-500">{{ checkedCount }} of {{ instances.length }} checked</p>
    </div>

    <div v-if="!instances.length" class="py-12 text-center" role="status">
      <h3 class="text-lg font-medium text-white">No instances configured</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm text-gray-400">Add a media service to test connections and open it from MediaHub.</p>
      <button
        @click="openProviderPicker"
        :disabled="!isPro"
        class="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add instance
      </button>
    </div>

    <div v-else-if="visibleInstances.length" class="mt-4 space-y-3" role="list">
      <article
        v-for="entry in visibleInstances"
        :key="entry.instance.id"
        class="rounded-lg border border-gray-700 bg-gray-700/60 p-4"
        role="listitem"
        :aria-label="`${entry.instance.name}, ${entry.service.name}`"
      >
        <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 gap-3">
            <img :src="entry.service.icon" :alt="`${entry.service.name} icon`" width="36" height="36" class="h-9 w-9 shrink-0 rounded" />
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="truncate font-medium text-white">{{ entry.instance.name }}</h3>
                <span v-if="entry.instance.isDefault" class="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">Default</span>
              </div>
              <p class="text-xs text-gray-400">{{ entry.service.name }}</p>
              <p class="mt-2 break-all font-mono text-xs text-gray-400">{{ normalizedUrl(entry) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:shrink-0">
            <button
              @click="emit('edit-instance', entry)"
              class="rounded-md p-2 text-blue-300 hover:bg-blue-500/10 hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              :aria-label="`Edit ${entry.instance.name}`"
              :title="`Edit ${entry.instance.name}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button
              @click="emit('delete-instance', entry)"
              class="rounded-md p-2 text-red-300 hover:bg-red-500/10 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              :aria-label="`Delete ${entry.instance.name}`"
              :title="`Delete ${entry.instance.name}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 01-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-gray-600/70 pt-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-2 text-xs">
            <span v-for="capability in capabilitiesFor(entry)" :key="capability" class="rounded-full bg-gray-600 px-2 py-1 text-gray-100">{{ capability }}</span>
            <span class="rounded-full bg-gray-600 px-2 py-1 text-gray-300">{{ isServiceInstalled(entry.service) ? "Native app installed" : "Native app missing" }}</span>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div class="min-w-0 sm:text-right" role="status" aria-live="polite">
              <span class="rounded-full px-2 py-1 text-xs font-medium" :class="statusClass(statusFor(entry))">{{ statusLabel(statusFor(entry)) }}</span>
              <p class="mt-1 text-xs text-gray-400">{{ detailFor(entry) }}</p>
              <p v-if="resultFor(entry)?.httpStatus" class="text-xs text-gray-500">HTTP {{ resultFor(entry)?.httpStatus }}</p>
            </div>
            <button
              @click="emit('test-instance', entry)"
              :disabled="testingIds.has(entry.instance.id)"
              class="rounded-md border border-blue-400/70 px-3 py-2 text-sm font-medium text-blue-200 hover:border-blue-300 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-50"
            >
              {{ testingIds.has(entry.instance.id) ? "Testing…" : resultFor(entry) ? "Test again" : "Test connection" }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="py-12 text-center" role="status">
      <h3 class="text-lg font-medium text-white">No matching instances</h3>
      <p class="mt-2 text-sm text-gray-400">Try another health filter to see the rest of your configured services.</p>
      <button @click="activeFilter = 'all'" class="mt-4 text-sm font-medium text-blue-300 hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">Show all instances</button>
    </div>

    <footer class="mt-6 flex flex-col gap-3 border-t border-gray-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs text-amber-200">Credentials are stored in this browser/device’s local storage.</p>
      <button @click="emit('clear-credentials')" class="self-start rounded-md border border-red-700 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">Clear local credentials</button>
    </footer>

    <div v-if="showProviderPicker" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="provider-picker-title">
      <div class="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 id="provider-picker-title" class="text-xl font-semibold">Add an instance</h3>
            <p class="mt-1 text-sm text-gray-400">Choose the service you want to configure.</p>
          </div>
          <button @click="closeProviderPicker" class="rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" aria-label="Close provider picker">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <label class="sr-only" for="provider-search">Search services</label>
        <input id="provider-search" v-model="providerQuery" name="provider-search" autocomplete="off" placeholder="Search services…" class="mt-5 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div class="mt-3 max-h-80 space-y-1 overflow-y-auto" role="list">
          <button
            v-for="service in filteredProviders"
            :key="service.id"
            @click="chooseProvider(service)"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            role="listitem"
          >
            <img :src="service.icon" :alt="`${service.name} icon`" width="28" height="28" class="h-7 w-7 rounded" />
            <span class="font-medium">{{ service.name }}</span>
            <span class="ml-auto text-sm text-gray-400">Add</span>
          </button>
          <p v-if="!filteredProviders.length" class="px-3 py-6 text-center text-sm text-gray-400">No matching services.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CustomServiceInstance, InstanceCheckResult, InstanceCheckStatus, Service } from "@/types";
import { normalizeInstanceUrl } from "@/utils/instanceHealth";

type InstanceEntry = { service: Service; instance: CustomServiceInstance };
type HealthFilter = "all" | "attention" | "unchecked";

const props = defineProps<{
  instances: InstanceEntry[];
  services: Service[];
  healthResults: Record<string, InstanceCheckResult>;
  testingIds: Set<string>;
  testingAll: boolean;
  isPro: boolean;
  isServiceInstalled: (service: Service) => boolean;
}>();

const emit = defineEmits<{
  "test-all": [];
  "test-instance": [entry: InstanceEntry];
  "add-instance": [service: Service];
  "edit-instance": [entry: InstanceEntry];
  "delete-instance": [entry: InstanceEntry];
  "clear-credentials": [];
}>();

const activeFilter = ref<HealthFilter>("all");
const showProviderPicker = ref(false);
const providerQuery = ref("");

function resultFor(entry: InstanceEntry) {
  return props.healthResults[entry.instance.id];
}

function statusFor(entry: InstanceEntry): InstanceCheckStatus {
  return resultFor(entry)?.status ?? "never_checked";
}

function statusLabel(status: InstanceCheckStatus) {
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
    never_checked: "bg-gray-600 text-gray-100",
    unsupported: "bg-gray-600 text-gray-100",
  }[status];
}

function isAttention(entry: InstanceEntry) {
  return !["healthy", "never_checked"].includes(statusFor(entry));
}

const checkedCount = computed(() => props.instances.filter(entry => Boolean(resultFor(entry))).length);
const attentionCount = computed(() => props.instances.filter(isAttention).length);
const uncheckedCount = computed(() => props.instances.filter(entry => statusFor(entry) === "never_checked").length);
const filters = computed(() => [
  { id: "all" as const, label: "All", count: props.instances.length },
  { id: "attention" as const, label: "Needs attention", count: attentionCount.value },
  { id: "unchecked" as const, label: "Unchecked", count: uncheckedCount.value },
]);
const visibleInstances = computed(() => props.instances.filter(entry => {
  if (activeFilter.value === "attention") return isAttention(entry);
  if (activeFilter.value === "unchecked") return statusFor(entry) === "never_checked";
  return true;
}));
const filteredProviders = computed(() => {
  const query = providerQuery.value.trim().toLowerCase();
  return query ? props.services.filter(service => service.name.toLowerCase().includes(query)) : props.services;
});

function normalizedUrl(entry: InstanceEntry) {
  try { return normalizeInstanceUrl(entry.instance.baseUrl, entry.service.id === "kodi"); }
  catch { return entry.instance.baseUrl || "Invalid URL"; }
}

function capabilitiesFor(entry: InstanceEntry) {
  return resultFor(entry)?.capabilities ?? ["Web interface", "API access"];
}

function detailFor(entry: InstanceEntry) {
  const result = resultFor(entry);
  if (!result) return "Not checked yet";
  return `${result.message} · ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(result.checkedAt))}`;
}

function openProviderPicker() {
  if (props.isPro) showProviderPicker.value = true;
}

function closeProviderPicker() {
  showProviderPicker.value = false;
  providerQuery.value = "";
}

function chooseProvider(service: Service) {
  closeProviderPicker();
  emit("add-instance", service);
}
</script>
