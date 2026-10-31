export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const port = Number(env.PORT ?? "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const allowedOrigins = (env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  for (const origin of allowedOrigins) {
    const url = new URL(origin);
    if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin) {
      throw new Error(
        "ALLOWED_ORIGINS must contain HTTP(S) origins without paths or wildcards.",
      );
    }
  }

  return { port, allowedOrigins };
}
