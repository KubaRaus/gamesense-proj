import type { GameSearchResponse } from "@gamesense/types";
import type { GamesCatalogGateway } from "./games-catalog.gateway";
import type { SearchGamesQuery } from "./games.use-cases";

export class GamesService {
  constructor(private readonly gamesCatalogGateway: GamesCatalogGateway) {}

  async searchGames(query: SearchGamesQuery): Promise<GameSearchResponse> {
    const limit = query.limit ?? 20;
    const results = await this.gamesCatalogGateway.searchGames(query.q, limit);

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
