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
  console.log("platform", platform);
  if (platform === "ios" || platform === "android") {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
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

configure().then(() => {
  console.log("RevenueCat SDK configured!");
  app.mount("#app");
});
