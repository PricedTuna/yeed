import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only unmounts rendered components automatically when Vitest
// globals are enabled. This project imports test functions explicitly instead.
afterEach(() => {
  cleanup();
});
