import { loadConfig } from "./config.ts";
import { healthRouter } from "./routes/health.ts";
import { createHttpApp } from "./shared/http.ts";

export function createApp() {
  const { allowedOrigins } = loadConfig();
  return createHttpApp(healthRouter, { allowedOrigins });
}
