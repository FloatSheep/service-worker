/** vite config */

import { defineConfig } from "vite";

export default defineConfig({
  worker: {
    rollupOptions: {
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === "service-worker") {
            return "sw.js";
          }
          return "[name]-[hash].js";
        },
      },
    },
  },
});
