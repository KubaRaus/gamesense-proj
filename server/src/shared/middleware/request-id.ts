import type { NextFunction, Request, Response } from "express";

function createRequestId() {
  return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function requestIdMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.locals.requestId = createRequestId();
  next();
}
