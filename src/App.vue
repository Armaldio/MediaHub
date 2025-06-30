<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useServicesStore } from '@/stores/services'

const servicesStore = useServicesStore()

onMounted(() => {
  servicesStore.loadFromLocalStorage()
})
</script>