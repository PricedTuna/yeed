import { createApp } from "./app.ts";
import { loadConfig } from "./config.ts";

const { port } = loadConfig();
const server = createApp().listen(port, "0.0.0.0", () => {
  console.info(
    JSON.stringify({
      level: "INFO",
      service: "yeed-api",
      message: "API listening",
      port,
    }),
  );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    const timeout = setTimeout(() => process.exit(1), 10_000);
    timeout.unref();
    server.close(() => {
      clearTimeout(timeout);
    });
  });
}
