import { Router } from "express";
import {
  steamCallbackController,
  steamExchangeController,
  steamLoginController
} from "./auth.controller";

const authRouter = Router();

authRouter.get("/steam", steamLoginController);
authRouter.get("/steam/callback", steamCallbackController);
authRouter.post("/steam/exchange", steamExchangeController);

export { authRouter };
