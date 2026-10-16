// Types for the variables listed in apps/web/.env.example. Vite only exposes
// variables that start with VITE_, and their values end up in the JavaScript
// sent to the browser, so they must never contain secrets.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
