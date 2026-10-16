import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/ and https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // `@/` points to `src/`, so imports do not depend on the file's depth.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    // Fail instead of silently moving to another port: the API only accepts
    // requests from known origins (CORS).
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Tests never depend on a developer's .env.local.
    env: { VITE_API_BASE_URL: "http://api.test" },
    restoreMocks: true,
    unstubGlobals: true,
  },
});
