import { Router } from "express";
import { requireAuth } from "../../shared/middleware/require-auth";
import { userProfileController } from "./users.controller";

const usersRouter = Router();

usersRouter.get("/:userId/profile", requireAuth, userProfileController);

export { usersRouter };
