import { once } from "node:events";
import type { TestContext } from "node:test";
import type { Express } from "express";

export const silentLogger = {
  info: () => {
    /* Silence request logs in HTTP tests. */
  },
  error: () => {
    /* Error logging is asserted with a mock where needed. */
  },
};

export async function startServer(t: TestContext, app: Express) {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
        server.closeAllConnections();
      }),
  );
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Missing server address.");
  return `http://127.0.0.1:${String(address.port)}`;
}
