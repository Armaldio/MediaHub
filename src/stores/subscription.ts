import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setupPurchase } from '../plugins/purchase'

interface PurchaseRecord {
  id: string
  date: Date
  productId: string
  platform: string
}

interface Entitlement {
  unlimitedServices: boolean
  customInstances: boolean
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const isSubscribed = ref(false)
  const entitlements = ref<Entitlement>({
    unlimitedServices: false,
    customInstances: false
  })
  const purchaseHistory = ref<PurchaseRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize purchase plugin
  const purchasePlugin = setupPurchase()

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    if (!purchasePlugin) {
      error.value = 'Purchase plugin not available'
      return
    }

    try {
      loading.value = true
      error.value = null

      const validation = await purchasePlugin.validateSubscription()
      isSubscribed.value = validation.isSubscribed

      // Update entitlements based on subscription
      entitlements.value = {
        unlimitedServices: isSubscribed.value,
        customInstances: isSubscribed.value
      }

      return validation
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to check subscription'
      console.error('Error checking subscription:', err)
    } finally {
      loading.value = false
    }
  }

  // Purchase subscription
  const purchaseSubscription = async () => {
    if (!purchasePlugin) {
      error.value = 'Purchase plugin not available'
      return false
    }

    try {
      loading.value = true
      error.value = null

      await purchasePlugin.purchaseSubscription()

      // Add to purchase history
      const record: PurchaseRecord = {
        id: Date.now().toString(),
        date: new Date(),
        productId: 'basic_subscription',
        platform: 'google_play'
      }
      purchaseHistory.value.push(record)

      // Check status after purchase
      await checkSubscriptionStatus()

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to purchase subscription'
      console.error('Error purchasing subscription:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Restore purchases
  const restorePurchases = async () => {
    if (!purchasePlugin) {
      error.value = 'Purchase plugin not available'
      return false
    }

    try {
      loading.value = true
      error.value = null

      await purchasePlugin.restorePurchases()

      // Check status after restore
      await checkSubscriptionStatus()

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to restore purchases'
      console.error('Error restoring purchases:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get product details
  const getProductDetails = async () => {
    if (!purchasePlugin) {
      error.value = 'Purchase plugin not available'
      return null
    }

    try {
      return await purchasePlugin.getProductDetails()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get product details'
      console.error('Error getting product details:', err)
      return null
    }
  }

  // Computed properties for easy access
  const hasUnlimitedServices = computed(() => entitlements.value.unlimitedServices)
  const hasCustomInstances = computed(() => entitlements.value.customInstances)

  // Initialize on store creation
  checkSubscriptionStatus()

  return {
    isSubscribed,
    entitlements,
    purchaseHistory,
    loading,
    error,
    hasUnlimitedServices,
    hasCustomInstances,
    checkSubscriptionStatus,
    purchaseSubscription,
    restorePurchases,
    getProductDetails
  }
})