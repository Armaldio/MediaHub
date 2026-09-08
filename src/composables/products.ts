import { Purchases } from "@revenuecat/purchases-capacitor";
import { onMounted, ref } from "vue";

export const useProducts = () => {
  const isPro = ref(false);

  const hasPro = async () => {
    // Keep local development focused on feature work; production still requires
    // a real RevenueCat entitlement.
    if (import.meta.env.DEV) return true;
    if (import.meta.env.VITE_BYPASS_PREMIUM === "true") return true;

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();

      console.log("RevenueCat customerInfo:", customerInfo);
      console.log(
        "RevenueCat active entitlements:",
        Object.keys(customerInfo.entitlements.active)
      );

      if (
        typeof customerInfo.entitlements.active["custom-instances"] !== "undefined" ||
        typeof customerInfo.entitlements.active["unlimited-services"] !== "undefined"
      ) {
        return true;
      }
    } catch (e) {
      console.error("RevenueCat hasPro error:", e);
      return false;
    }
    return false;
  };

  onMounted(async () => {
    isPro.value = await hasPro();
  });

  return {
    hasPro,

    isPro,
  };
};
