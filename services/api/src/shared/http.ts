import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler, Router } from "express";

import { ApiError } from "./errors.ts";

interface AppOptions {
  allowedOrigins?: string[];
  logger?: Pick<Console, "info" | "error">;
}

export function createHttpApp(routes: Router, options: AppOptions = {}) {
  const { allowedOrigins = ["http://localhost:5173"], logger = console } =
    options;
  const app = express();
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    const requestId = randomUUID();
    res.setHeader("X-Request-Id", requestId);
    res.on("finish", () => {
      logger.info(
        JSON.stringify({
          level: "INFO",
          service: "yeed-api",
          request_id: requestId,
          method: req.method,
          status: res.statusCode,
        }),
      );
    });
    next();
  });
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET"],
      allowedHeaders: ["Content-Type"],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(routes);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: "not_found",
        message: "The requested route does not exist.",
      },
    });
  });

  const handleError: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof ApiError) {
      res
        .status(error.status)
        .json({ error: { code: error.code, message: error.message } });
      return;
    }

    if (error instanceof Error && "type" in error) {
      if (error.type === "entity.parse.failed") {
        res.status(400).json({
          error: {
            code: "invalid_json",
            message: "The request body must be valid JSON.",
          },
        });
        return;
      }
      if (error.type === "entity.too.large") {
        res.status(413).json({
          error: {
            code: "payload_too_large",
            message: "The request body is too large.",
          },
        });
        return;
      }
    }

    logger.error(
      JSON.stringify({
        level: "ERROR",
        service: "yeed-api",
        request_id: res.getHeader("X-Request-Id"),
        message: "Unhandled error",
        error: error instanceof Error ? error.stack : "Unknown error",
      }),
    );
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Something went wrong on our side. Please try again later.",
      },
    });
  };
  app.use(handleError);
  return app;
}
