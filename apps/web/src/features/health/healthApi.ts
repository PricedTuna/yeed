import { apiRequest, type RequestOptions } from "@/services/apiClient";
import { isRecord } from "@/utils/isRecord";

/** Body of `GET /health`. */
export interface HealthResponse {
  status: "ok";
  service: string;
}

export function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    isRecord(value) &&
    value.status === "ok" &&
    typeof value.service === "string"
  );
}

export function getHealth(
  options: Pick<RequestOptions, "signal"> = {},
): Promise<HealthResponse> {
  return apiRequest("/health", isHealthResponse, options);
}
