import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/apiClient";
import { getHealth, type HealthResponse } from "./healthApi";

export type HealthCheckState =
  | { status: "loading" }
  | { status: "success"; health: HealthResponse }
  | { status: "error"; message: string };

/** Calls `GET /health` when the component mounts and every time `retry` is called. */
export function useHealthCheck(): {
  state: HealthCheckState;
  retry: () => void;
} {
  const [state, setState] = useState<HealthCheckState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getHealth({ signal: controller.signal })
      .then((health) => {
        setState({ status: "success", health });
      })
      .catch((error: unknown) => {
        // The component unmounted or a new attempt started: nobody needs this result.
        if (controller.signal.aborted) {
          return;
        }
        setState({ status: "error", message: toUserMessage(error) });
      });

    return () => {
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }, []);

  return { state, retry };
}

function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  // An unexpected error is a bug: keep the details for developers, not for users.
  console.error(error);
  return "Something went wrong. Please try again.";
}
