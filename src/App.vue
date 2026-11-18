<template>
  <div class="min-h-screen bg-canvas">
    <!-- Fixed strips painted behind the system bars so that content scrolling
         up can never appear under the status-bar icons or the nav bar. They are
         app-colored and sit behind the (translucent) native bars, keeping the
         edge-to-edge blend. pointer-events-none so they never block taps. -->
    <div
      class="fixed top-0 left-0 right-0 z-40 pointer-events-none bg-canvas"
      style="height: env(safe-area-inset-top, 0px)"
    ></div>
    <div
      class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none bg-canvas"
      style="height: env(safe-area-inset-bottom, 0px)"
    ></div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { setupDeepLinkHandler } from '@/utils/deepLinkHandler'

const servicesStore = useServicesStore()
const router = useRouter()

onMounted(() => {
  servicesStore.loadFromLocalStorage()
  // Initialize deep link handler
  setupDeepLinkHandler(router)
})
</script>