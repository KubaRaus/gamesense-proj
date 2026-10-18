import type {
  CatalogGame,
  GamesCatalogGateway
} from "../../modules/games/games-catalog.gateway";

const GAMES: CatalogGame[] = [
  {
    igdbId: 7346,
    name: "Elden Ring",
    coverUrl: null,
    releaseYear: 2022,
    genres: ["RPG", "Action"]
  },
  {
    igdbId: 1020,
    name: "Portal 2",
    coverUrl: null,
    releaseYear: 2011,
    genres: ["Puzzle", "Adventure"]
  },
  {
    igdbId: 22511,
    name: "Hades",
    coverUrl: null,
    releaseYear: 2020,
    genres: ["Roguelike", "Action"]
  }
];

export class InMemoryGamesCatalogGateway implements GamesCatalogGateway {
  async searchGames(query: string, limit: number): Promise<CatalogGame[]> {
    const normalized = query.toLowerCase();
    return GAMES.filter((game) => game.name.toLowerCase().includes(normalized)).slice(0, limit);
  }
}
