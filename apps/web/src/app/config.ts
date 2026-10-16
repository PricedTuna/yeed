/** Application settings that Vite injects at build time from `.env*` files. */
export interface AppConfig {
  /** Base URL of the Yeed API, without a trailing slash. */
  readonly apiBaseUrl: string;
}

type ConfigSource = Pick<ImportMetaEnv, "VITE_API_BASE_URL">;

/**
 * Validates the raw environment values. A wrong configuration stops the app on
 * startup instead of sending requests to the wrong place.
 */
export function loadConfig(env: ConfigSource): AppConfig {
  const rawUrl = env.VITE_API_BASE_URL?.trim();
  if (!rawUrl) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Copy apps/web/.env.example to apps/web/.env.local.",
    );
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`VITE_API_BASE_URL is not a valid URL: "${rawUrl}".`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `VITE_API_BASE_URL must start with http:// or https://: "${rawUrl}".`,
    );
  }

  return { apiBaseUrl: rawUrl.replace(/\/+$/, "") };
}

export const config: AppConfig = loadConfig(import.meta.env);
