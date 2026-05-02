import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback-blog",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.method !== "GET" || !req.url) return next();
          const path = req.url.split("?")[0];
          const spaPaths = new Set([
            "/blog",
            "/blog/",
            "/privacy",
            "/privacy/",
            "/terms",
            "/terms/",
          ]);
          if (spaPaths.has(path)) {
            req.url = "/index.html" + (req.url.includes("?") ? "?" + req.url.split("?")[1] : "");
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.method !== "GET" || !req.url) return next();
          const path = req.url.split("?")[0];
          const spaPaths = new Set([
            "/blog",
            "/blog/",
            "/privacy",
            "/privacy/",
            "/terms",
            "/terms/",
          ]);
          if (spaPaths.has(path)) {
            req.url = "/index.html" + (req.url.includes("?") ? "?" + req.url.split("?")[1] : "");
          }
          next();
        });
      },
    },
  ],
});
