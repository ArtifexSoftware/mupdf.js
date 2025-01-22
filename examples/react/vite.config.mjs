import react from "@vitejs/plugin-react";
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["mupdf"], // Exclude mupdf from pre-bundling
  },
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        worker: resolve(__dirname, "src/workers/mupdf.worker.ts"),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
