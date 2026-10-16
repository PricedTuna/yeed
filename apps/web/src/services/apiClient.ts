import { config } from "@/app/config";
import { isRecord } from "@/utils/isRecord";

const DEFAULT_TIMEOUT_MS = 10_000;
const INVALID_JSON = Symbol("invalid JSON");

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  /** Sent as JSON. */
  body?: unknown;
  /** Lets the caller cancel the request, for example when a component unmounts. */
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Error for any failed API call. `message` is safe to show to users and `code`
 * is meant for program logic. `status` is `null` when no HTTP response arrived.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number | null;

  constructor(
    message: string,
    code: string,
    status: number | null,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Sends a request to the Yeed API and returns its JSON body after `isExpected`
 * confirms the shape. TypeScript types do not exist at runtime, so every
 * response is checked before the rest of the app uses it.
 */
export async function apiRequest<T>(
  path: string,
  isExpected: (data: unknown) => data is T,
  options: RequestOptions = {},
): Promise<T> {
  if (!path.startsWith("/")) {
    throw new Error(`API paths must start with "/": "${path}".`);
  }

  const {
    method = "GET",
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  let response: Response;
  let text: string;
  try {
    response = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers:
        body === undefined
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
    });
    text = await response.text();
  } catch (error) {
    throw toRequestError(error);
  }

  const data = parseJson(text);
  if (!response.ok) {
    throw toHttpError(response.status, data);
  }
  if (!isExpected(data)) {
    throw new ApiError(
      "The server sent an unexpected response.",
      "invalid_response",
      response.status,
    );
  }
  return data;
}

function parseJson(text: string): unknown {
  if (text === "") {
    return undefined;
  }
  try {
    const data: unknown = JSON.parse(text);
    return data;
  } catch {
    return INVALID_JSON;
  }
}

function toRequestError(error: unknown): Error {
  if (error instanceof DOMException && error.name === "AbortError") {
    // Cancelled by the caller, not a failure: rethrow it so the caller can ignore it.
    return error;
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new ApiError(
      "The server took too long to respond. Please try again.",
      "timeout",
      null,
      { cause: error },
    );
  }
  return new ApiError(
    "Could not connect to the server. Check your connection and try again.",
    "network_error",
    null,
    { cause: error },
  );
}

/** Error body sent by the Yeed API: `{ "error": { "code": "...", "message": "..." } }`. */
interface ErrorBody {
  error: { code: string; message: string };
}

function isErrorBody(value: unknown): value is ErrorBody {
  if (!isRecord(value)) {
    return false;
  }
  const { error } = value;
  return (
    isRecord(error) &&
    typeof error.code === "string" &&
    typeof error.message === "string"
  );
}

function toHttpError(status: number, data: unknown): ApiError {
  if (isErrorBody(data)) {
    return new ApiError(data.error.message, data.error.code, status);
  }
  return new ApiError(
    `The server responded with an error (${String(status)}).`,
    "http_error",
    status,
  );
}
