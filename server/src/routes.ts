import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { compatibilityRouter } from "./modules/compatibility/compatibility.routes";
import { gamesRouter } from "./modules/games/games.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/compatibility", compatibilityRouter);
apiRouter.use("/games", gamesRouter);

export { apiRouter };
