import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/ravenwatch-web/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        benchmarks: "benchmarks/index.html",
        main: "index.html",
      },
    },
  },
});
