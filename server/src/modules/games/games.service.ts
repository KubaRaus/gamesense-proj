import type { GameSearchResponse } from "@gamesense/types";
import { IgdbClient } from "../../integrations/igdb/igdb.client";
import type { GamesSearchQuery } from "./games.schemas";

const igdbClient = new IgdbClient();

export class GamesService {
  async searchGames(query: GamesSearchQuery): Promise<GameSearchResponse> {
    const limit = query.limit ?? 20;
    const results = await igdbClient.searchGames(query.q, limit);

    return {
      query: query.q,
      total: results.length,
      items: results.map((result) => ({
        id: `game_${result.igdbId}`,
        igdbId: result.igdbId,
        name: result.name,
        coverUrl: result.coverUrl,
        releaseYear: result.releaseYear,
        genres: result.genres
      }))
    };
  }
}
