import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

import { Capacitor } from "@capacitor/core";

async function configureAndroidWindow() {
  if (Capacitor.getPlatform() !== "android") return;
  try {
    const [{ EdgeToEdge }, { StatusBar, Style }] = await Promise.all([
      import("@capawesome/capacitor-android-edge-to-edge-support"),
      import("@capacitor/status-bar"),
    ]);
    // MainActivity draws behind the system bars. Let CSS apply safe-area padding.
    await EdgeToEdge.disable();
    await EdgeToEdge.setBackgroundColor({ color: "#00000000" });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (error) {
    console.error("Edge-to-edge setup failed:", error);
  }
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Keep the inline startup UI visible until the route and its styles are ready.
Promise.all([router.isReady(), import("./style.css")]).then(() => {
  app.mount("#app");
  void configureAndroidWindow();
}).catch((error) => {
  console.error("Unable to start MediaHub:", error);
  window.dispatchEvent(new Event("mediahub:startup-error"));
});
