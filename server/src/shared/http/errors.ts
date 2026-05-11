import type { Response } from "express";
import type { ApiErrorResponse } from "@gamesense/types";

export function sendApiError(
  res: Response,
  statusCode: number,
  code: string,
  message: string
) {
  const requestId =
    typeof res.locals.requestId === "string"
      ? res.locals.requestId
      : `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  const payload: ApiErrorResponse = {
    error: {
      code,
      message,
      requestId
    }
  };

  return res.status(statusCode).json(payload);
}
