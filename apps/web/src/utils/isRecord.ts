/** Narrows an unknown value, such as parsed JSON, to an object whose properties can be read. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
