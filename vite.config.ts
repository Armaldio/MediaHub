import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      vue(),
      tailwindcss(),
      ...(process.env.VUE_DEVTOOLS === "true"
        ? [(await import("vite-plugin-vue-devtools")).default()]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
