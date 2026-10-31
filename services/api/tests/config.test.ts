import assert from "node:assert/strict";
import { test } from "node:test";

import { loadConfig } from "../src/config.ts";

await test("configuration defaults match the frontend's local URL", () => {
  assert.deepEqual(loadConfig({}), {
    port: 3000,
    allowedOrigins: ["http://localhost:5173"],
  });
});

await test("configuration accepts a custom port and multiple origins", () => {
  assert.deepEqual(
    loadConfig({
      PORT: "8080",
      ALLOWED_ORIGINS: "https://web.example.com, http://localhost:5173",
    }),
    {
      port: 8080,
      allowedOrigins: ["https://web.example.com", "http://localhost:5173"],
    },
  );
});

await test("configuration rejects invalid ports", () => {
  for (const port of ["", "0", "-1", "3.5", "65536", "abc"]) {
    assert.throws(() => loadConfig({ PORT: port }), /PORT/);
  }
});

await test("configuration rejects wildcards, empty origins and paths", () => {
  for (const origin of [
    "*",
    "",
    "https://web.example.com/path",
    "https://web.example.com,",
    "ftp://web.example.com",
  ]) {
    assert.throws(() => loadConfig({ ALLOWED_ORIGINS: origin }));
  }
});
