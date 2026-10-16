import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { isRecord } from "@/utils/isRecord";
import { ApiError, apiRequest } from "./apiClient";

interface Greeting {
  message: string;
}

function isGreeting(value: unknown): value is Greeting {
  return isRecord(value) && typeof value.message === "string";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function captureError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject.");
}

let fetchMock: Mock<typeof fetch>;

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
});

describe("apiRequest", () => {
  it("sends a GET request to the API base URL and returns the checked body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "hello" }));

    await expect(apiRequest("/greetings", isGreeting)).resolves.toEqual({
      message: "hello",
    });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("http://api.test/greetings");
    expect(init?.method).toBe("GET");
    expect(init?.headers).toEqual({ Accept: "application/json" });
    expect(init?.body).toBeUndefined();
  });

  it("sends the request body as JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "created" }, 201));

    await apiRequest("/greetings", isGreeting, {
      method: "POST",
      body: { name: "Ada" },
    });

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.body).toBe('{"name":"Ada"}');
    expect(init?.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  });

  it("turns an API error body into an ApiError", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: "not_found", message: "Resource not found." } },
        404,
      ),
    );

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: "not_found",
      message: "Resource not found.",
      status: 404,
    });
  });

  it("reports an HTTP error when the error body is not in the API format", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>Bad Gateway</html>", { status: 502 }),
    );

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toMatchObject({ code: "http_error", status: 502 });
  });

  it("rejects a successful response with an unexpected shape", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ unexpected: true }));

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toMatchObject({ code: "invalid_response", status: 200 });
  });

  it("rejects a successful response that is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("not json", { status: 200 }));

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toMatchObject({ code: "invalid_response", status: 200 });
  });

  it("reports a timeout", async () => {
    fetchMock.mockRejectedValue(
      new DOMException("The operation timed out.", "TimeoutError"),
    );

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toMatchObject({ code: "timeout", status: null });
  });

  it("reports a network error", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await captureError(apiRequest("/greetings", isGreeting));

    expect(error).toMatchObject({ code: "network_error", status: null });
  });

  it("rethrows cancellations unchanged so callers can ignore them", async () => {
    const abortError = new DOMException(
      "The operation was aborted.",
      "AbortError",
    );
    fetchMock.mockRejectedValue(abortError);

    await expect(apiRequest("/greetings", isGreeting)).rejects.toBe(abortError);
  });

  it("rejects paths that do not start with a slash", async () => {
    await expect(apiRequest("greetings", isGreeting)).rejects.toThrow(
      /must start with "\/"/,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
