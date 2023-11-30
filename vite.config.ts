import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src", // Adjust the path to your source directory
    },
  },
});
