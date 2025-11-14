import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./style.css";

import { SafeArea } from "@capacitor-community/safe-area";
import { LOG_LEVEL, Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: "#00000000", // transparent
    statusBarContent: "light",
    navigationBarColor: "#00000000", // transparent
    navigationBarContent: "light",
  },
});

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
