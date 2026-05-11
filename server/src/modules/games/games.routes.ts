import { Router } from "express";
import { gamesSearchController } from "./games.controller";

const gamesRouter = Router();

gamesRouter.get("/search", gamesSearchController);

export { gamesRouter };
