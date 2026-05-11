import type { Request, Response } from "express";
import { sendApiError } from "../../shared/http/errors";
import { compatibilityParamsSchema } from "./compatibility.schemas";
import { CompatibilityService } from "./compatibility.service";

const compatibilityService = new CompatibilityService();

export async function compatibilityController(req: Request, res: Response) {
  const parsed = compatibilityParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return sendApiError(res, 400, "INVALID_PARAMS", "Invalid compatibility parameters.");
  }

  if (parsed.data.userA === parsed.data.userB) {
    return sendApiError(res, 400, "INVALID_COMPARISON", "Players must be different users.");
  }

  const response = await compatibilityService.getCompatibility(parsed.data);
  if (!response) {
    return sendApiError(res, 404, "USER_NOT_FOUND", "One or both users were not found.");
  }

  return res.status(200).json(response);
}
