import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { Router } from "express";

import { ApiError } from "../src/shared/errors.ts";
import { createHttpApp } from "../src/shared/http.ts";
import { silentLogger, startServer } from "./support.ts";

await test("expected API errors preserve their status and public message", async (t) => {
  const routes = Router();
  routes.get("/conflict", () => {
    throw new ApiError(409, "already_exists", "That item already exists.");
  });
  const baseUrl = await startServer(
    t,
    createHttpApp(routes, { logger: silentLogger }),
  );
  const response = await fetch(`${baseUrl}/conflict`);
  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    error: { code: "already_exists", message: "That item already exists." },
  });
});

for (const asyncError of [false, true]) {
  await test(`${asyncError ? "async" : "sync"} unexpected errors are logged without exposing details`, async (t) => {
    const routes = Router();
    const fail = () => {
      throw new Error("connection to db-internal.example failed");
    };
    routes.get("/boom", asyncError ? () => Promise.resolve().then(fail) : fail);
    const logger = {
      info: silentLogger.info,
      error: mock.fn<(message: string) => void>(),
    };
    const baseUrl = await startServer(t, createHttpApp(routes, { logger }));
    const response = await fetch(`${baseUrl}/boom`);
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: {
        code: "internal_error",
        message: "Something went wrong on our side. Please try again later.",
      },
    });
    const log = logger.error.mock.calls[0]?.arguments[0] ?? "";
    assert.match(log, /db-internal/);
    assert.ok(
      log.includes(
        response.headers.get("x-request-id") ?? "missing-request-id",
      ),
    );
  });
}

await test("malformed JSON uses the standard error response", async (t) => {
  const baseUrl = await startServer(
    t,
    createHttpApp(Router(), { logger: silentLogger }),
  );
  const response = await fetch(`${baseUrl}/anything`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"invalid":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: {
      code: "invalid_json",
      message: "The request body must be valid JSON.",
    },
  });
});

await test("oversized JSON uses the standard error response", async (t) => {
  const baseUrl = await startServer(
    t,
    createHttpApp(Router(), { logger: silentLogger }),
  );
  const response = await fetch(`${baseUrl}/anything`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "x".repeat(110_000) }),
  });
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: {
      code: "payload_too_large",
      message: "The request body is too large.",
    },
  });
});
