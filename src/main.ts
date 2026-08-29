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
    try {
      // The plugin insets the WebView by default; disable that so the app
      // renders full-bleed. MainActivity already set the window to draw behind
      // the bars, so the app's background color shows through the transparent bars.
      await EdgeToEdge.disable();
      await EdgeToEdge.setBackgroundColor({ color: "#00000000" });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: "#0f0f0f" });
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
      console.error("Edge-to-edge setup failed:", e);
    }
  }
};

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
  configure().then(() => {
    "RevenueCat SDK configured!";
  });
});
