/** vite config */

import { defineConfig } from "vite";

export default defineConfig({
  worker: {
    rollupOptions: {
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === "sw") {
            // 需要把 sw 放在根目录，否则无法生效
            return "[name].js";
          }
          return "[name]-[hash].js";
        },
      },
    },
  },
});
