import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@govsky/config"],
  },
  build: {
    commonjsOptions: {
      include: [/@govsky\/config/, /node_modules/],
    },
  },
});
