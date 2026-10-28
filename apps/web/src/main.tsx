// Order matters: motion-kit's base styles, then the Yeed theme, then our own rules.
import "@yewdiel21/motion-kit/css";
import "@/app/styles/yeed.css";
import "@/app/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('The element with id "root" is missing from index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
