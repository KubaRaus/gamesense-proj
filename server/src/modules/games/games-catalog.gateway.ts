export interface CatalogGame {
  igdbId: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: string[];
}

export interface GamesCatalogGateway {
  searchGames(query: string, limit: number): Promise<CatalogGame[]>;
}
