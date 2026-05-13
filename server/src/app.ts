import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";
import { requestIdMiddleware } from "./shared/middleware/request-id";
import { assertRuntimeEnv } from "./shared/config/runtime-env";

export function createApp() {
  assertRuntimeEnv();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestIdMiddleware);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "gamesense-server" });
  });

  app.use("/api", apiRouter);

  return app;
}
