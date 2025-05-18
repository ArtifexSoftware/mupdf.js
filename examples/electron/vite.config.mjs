import react from "@vitejs/plugin-react";
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important: Use a relative path ('./') for Electron apps.
  // Reason: Electron loads files using the file:// protocol.
  // If you use an absolute path (e.g., '/assets/...'), it tries to load resources
  // from the root directory of the file system, which will fail.
  // A relative base path ensures assets are correctly resolved from index.html in dist.
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
