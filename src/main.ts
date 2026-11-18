import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./style.css";

import { Capacitor } from "@capacitor/core";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";

async function configureAndroidWindow() {
  if (Capacitor.getPlatform() !== "android") return;
  try {
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

router.isReady().then(() => {
  app.mount("#app");
  void configureAndroidWindow();
});
