import type { Request, Response } from "express";
import { sendApiError } from "../../shared/http/errors";
import { userProfileParamsSchema } from "./users.schemas";
import { usersService } from "./users.dependencies";

export async function userProfileController(req: Request, res: Response) {
  const parsed = userProfileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return sendApiError(res, 400, "INVALID_PARAMS", "Invalid user profile parameters.");
  }

  const response = await usersService.getProfile(parsed.data);
  if (!response) {
    return sendApiError(res, 404, "USER_NOT_FOUND", "User was not found.");
  }

  return res.status(200).json(response);
}
