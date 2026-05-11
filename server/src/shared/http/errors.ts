import type { Response } from "express";
import type { ApiErrorResponse } from "@gamesense/types";

function createRequestId() {
  return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function sendApiError(
  res: Response,
  statusCode: number,
  code: string,
  message: string
) {
  const payload: ApiErrorResponse = {
    error: {
      code,
      message,
      requestId: createRequestId()
    }
  };

  return res.status(statusCode).json(payload);
}
