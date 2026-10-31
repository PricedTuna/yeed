import { Router } from "express";

export const healthRouter = Router();

// Reports reachability without exposing configuration or querying other services.
healthRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "yeed-api" });
});
