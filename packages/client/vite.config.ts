import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src",
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // If you get out-of-memory issues, it's probably due to sourcemaps. Try
    // doing more code splitting more manual chunks below.
    sourcemap: true,
    assetsInlineLimit: 0,
    target: "es2022",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          phaser: ["phaser"],
          noa: ["noa-engine"],
          babylon: ["@babylonjs/core"],
          mud: [
            "@latticexyz/ecs-browser",
            "@latticexyz/network",
            "@latticexyz/phaserx",
            "@latticexyz/recs",
            "@latticexyz/services",
            "@latticexyz/std-client",
            "@latticexyz/utils",
          ],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
