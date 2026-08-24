import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./style.css";

import { LOG_LEVEL, Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";

const configure = async () => {
  const platform = Capacitor.getPlatform();
  if (platform === "ios" || platform === "android") {
    const level = import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO;
    await Purchases.setLogLevel({ level });
  }
  if (platform === "ios") {
    await Purchases.configure({
      apiKey: import.meta.env.VITE_REVENUECAT_API_KEY,
    });
  } else if (platform === "android") {
    await Purchases.configure({
      apiKey: import.meta.env.VITE_REVENUECAT_API_KEY,
    });
    await EdgeToEdge.enable();
    await EdgeToEdge.setBackgroundColor({ color: "#00000000" });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#00000000" });
    await StatusBar.setOverlaysWebView({ overlay: true });
  }
};

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
  configure().catch((err) => {
    console.error("Failed to configure SDKs:", err);
  });
});
