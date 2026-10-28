import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no matchMedia. Report "prefers-reduced-motion: reduce" so motion-kit
// renders every element in its final state without animating, which keeps the
// tests deterministic and independent of GSAP timing.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

// Testing Library only unmounts rendered components automatically when Vitest
// globals are enabled. This project imports test functions explicitly instead.
afterEach(() => {
  cleanup();
});
