import { Router } from "express";
import { steamCallbackController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/steam/callback", steamCallbackController);

export { authRouter };
