import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { handler } from "../src/lambda.ts";

await test("the Lambda adapter preserves the API Gateway v2 health response", async () => {
  const event = JSON.parse(
    readFileSync(new URL("../events/get-health.json", import.meta.url), "utf8"),
  ) as object;
  const response = await handler(event, { awsRequestId: "test-request-id" });
  assert.ok("statusCode" in response);
  assert.equal(response.statusCode, 200);
  assert.ok("body" in response && typeof response.body === "string");
  assert.deepEqual(JSON.parse(response.body), {
    status: "ok",
    service: "yeed-api",
  });
});
