import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies /api calls to the Flask backend so the browser
// never needs CORS gymnastics during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});
