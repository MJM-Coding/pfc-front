import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodePackageImporter } from "sass-embedded";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        importers: [new NodePackageImporter()],
      },
    },
  },
});
