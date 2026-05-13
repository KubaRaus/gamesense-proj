import type { Request, Response } from "express";
import { sendApiError } from "../../shared/http/errors";
import { steamCallbackBodySchema } from "./auth.schemas";
import { authService } from "./auth.dependencies";

export async function steamCallbackController(req: Request, res: Response) {
  const parsed = steamCallbackBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendApiError(res, 400, "INVALID_BODY", "Invalid Steam callback payload.");
  }

  const response = await authService.handleSteamCallback(parsed.data);
  return res.status(200).json(response);
}
