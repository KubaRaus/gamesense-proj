import type { Request, Response } from "express";
import { sendApiError } from "../../shared/http/errors";
import { gamesSearchQuerySchema } from "./games.schemas";
import { GamesService } from "./games.service";

const gamesService = new GamesService();

export async function gamesSearchController(req: Request, res: Response) {
  const parsed = gamesSearchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return sendApiError(res, 400, "INVALID_QUERY", "Invalid games search query.");
  }

  const response = await gamesService.searchGames(parsed.data);
  return res.status(200).json(response);
}
