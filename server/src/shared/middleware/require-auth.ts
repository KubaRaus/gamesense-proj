import type { NextFunction, Request, Response } from "express";
import { sendApiError } from "../http/errors";
import { verifyAccessToken } from "../auth/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return sendApiError(res, 401, "UNAUTHORIZED", "Missing or invalid Bearer token.");
  }

  const token = authorization.replace("Bearer ", "");
  try {
    verifyAccessToken(token);
    return next();
  } catch {
    return sendApiError(res, 401, "UNAUTHORIZED", "Invalid or expired token.");
  }
}
