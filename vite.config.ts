import { join } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PACKAGE_ROOT = __dirname;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  resolve: {
    alias: {
      "~/": join(PACKAGE_ROOT, "src") + "/",
      "~/components/": join(PACKAGE_ROOT, "src") + "/components/",
      "~/hooks/": join(PACKAGE_ROOT, "src") + "/hooks/",
      "~/styles/": join(PACKAGE_ROOT, "src") + "/styles/",
      "~/utils/": join(PACKAGE_ROOT, "src") + "/utils/",
    },
  },
}));
