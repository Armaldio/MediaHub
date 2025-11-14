import { Purchases } from "@revenuecat/purchases-capacitor";
import { onMounted, ref } from "vue";

export const useProducts = () => {
  const isPro = ref(false);

  const hasPro = async () => {
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();

      console.log("customerInfo", customerInfo);

      if (
        typeof customerInfo.entitlements.active["MediaHub Pro"] !== "undefined"
      ) {
        return true;
      }
    } catch (e) {
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
