import { Router } from "express";
import { requireAuth } from "../../shared/middleware/require-auth";
import { compatibilityController } from "./compatibility.controller";

const compatibilityRouter = Router();

compatibilityRouter.get("/:userA/:userB", requireAuth, compatibilityController);

export { compatibilityRouter };
