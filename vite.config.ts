/** vite config */

import { defineConfig } from "vite";

export default defineConfig({
  worker: {
    rollupOptions: {
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === "service-worker") {
            // 需要把 sw 放在根目录，否则无法生效
            return "sw.js";
          }
          return "[name]-[hash].js";
        },
      },
    },
  },
});
