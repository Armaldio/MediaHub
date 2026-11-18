import { onMounted, ref } from "vue";
import { Capacitor } from "@capacitor/core";
import { getPurchases } from "@/utils/purchases";

export async function hasPro() {
  if (import.meta.env.DEV || import.meta.env.VITE_BYPASS_PREMIUM === "true") return true;
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { customerInfo } = await (await getPurchases()).getCustomerInfo();
    const active = customerInfo.entitlements.active;
    return !!(active["custom-instances"] || active["unlimited-services"]);
  } catch (error) {
    console.error("Could not check subscription:", error);
    return false;
  }
}

export const useProducts = () => {
  const isPro = ref(false);

  onMounted(async () => {
    isPro.value = await hasPro();
  });

  return {
    hasPro,

    isPro,
  };
};
