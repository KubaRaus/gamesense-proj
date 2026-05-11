export interface IgdbGameResult {
  igdbId: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: string[];
}

const MOCK_IGDB_RESULTS: IgdbGameResult[] = [
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

export class IgdbClient {
  async searchGames(query: string, limit: number): Promise<IgdbGameResult[]> {
    const normalized = query.toLowerCase();
    return MOCK_IGDB_RESULTS.filter((game) => game.name.toLowerCase().includes(normalized)).slice(
      0,
      limit
    );
  }
}
