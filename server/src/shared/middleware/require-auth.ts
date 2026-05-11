import type { NextFunction, Request, Response } from "express";
import { sendApiError } from "../http/errors";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return sendApiError(res, 401, "UNAUTHORIZED", "Missing or invalid Bearer token.");
  }

  // Prototype middleware: token verification is intentionally deferred.
  return next();
}
