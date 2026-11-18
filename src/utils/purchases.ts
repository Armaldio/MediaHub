import { Capacitor } from "@capacitor/core";
import type { PurchasesPlugin } from "@revenuecat/purchases-capacitor";

let configuration: Promise<PurchasesPlugin> | undefined;

export function getPurchases(): Promise<PurchasesPlugin> {
  configuration ??= configurePurchases().catch((error) => {
    configuration = undefined;
    throw error;
  });
  return configuration;
}

async function configurePurchases(): Promise<PurchasesPlugin> {
  if (!Capacitor.isNativePlatform()) throw new Error("Purchases require the mobile app");
  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;
  if (!apiKey) throw new Error("RevenueCat API key is missing");

  const { LOG_LEVEL, Purchases } = await import("@revenuecat/purchases-capacitor");
  if (import.meta.env.DEV) await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
  await Purchases.configure({ apiKey });
  return Purchases;
}
