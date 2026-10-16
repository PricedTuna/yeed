import { describe, expect, it } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("returns the API base URL without a trailing slash", () => {
    expect(
      loadConfig({ VITE_API_BASE_URL: " https://api.example.com/ " }),
    ).toEqual({
      apiBaseUrl: "https://api.example.com",
    });
  });

  it("fails when the API base URL is missing", () => {
    expect(() => loadConfig({})).toThrow(/VITE_API_BASE_URL is not set/);
  });

  it("fails when the API base URL is not a URL", () => {
    expect(() => loadConfig({ VITE_API_BASE_URL: "not a url" })).toThrow(
      /not a valid URL/,
    );
  });

  it("fails when the protocol is missing", () => {
    // `new URL("localhost:3000")` is valid, with "localhost:" as its protocol.
    expect(() => loadConfig({ VITE_API_BASE_URL: "localhost:3000" })).toThrow(
      /must start with http/,
    );
  });
});
