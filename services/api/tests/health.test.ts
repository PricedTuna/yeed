import assert from "node:assert/strict";
import { test } from "node:test";

import { healthRouter } from "../src/routes/health.ts";
import { createHttpApp } from "../src/shared/http.ts";
import { silentLogger, startServer } from "./support.ts";

await test("GET /health preserves the public response", async (t) => {
  const baseUrl = await startServer(
    t,
    createHttpApp(healthRouter, { logger: silentLogger }),
  );
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/json/,
  );
  assert.deepEqual(await response.json(), {
    status: "ok",
    service: "yeed-api",
  });
  assert.ok(response.headers.get("x-request-id"));
  assert.equal(response.headers.get("x-powered-by"), null);
});

await test("unknown routes use the standard error response", async (t) => {
  const baseUrl = await startServer(
    t,
    createHttpApp(healthRouter, { logger: silentLogger }),
  );
  const response = await fetch(`${baseUrl}/missing`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: {
      code: "not_found",
      message: "The requested route does not exist.",
    },
  });
});

await test("CORS allows configured origins and answers browser preflight", async (t) => {
  const baseUrl = await startServer(
    t,
    createHttpApp(healthRouter, {
      allowedOrigins: ["https://web.example.com"],
      logger: silentLogger,
    }),
  );
  const response = await fetch(`${baseUrl}/health`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://web.example.com",
      "Access-Control-Request-Method": "GET",
    },
  });
  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://web.example.com",
  );
  assert.equal(response.headers.get("access-control-allow-methods"), "GET");
  assert.equal(
    response.headers.get("access-control-allow-headers"),
    "Content-Type",
  );

  const denied = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "https://other.example.com" },
  });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});
