export interface SteamGameGenreMetadata {
  igdbGenreId: number;
  name: string;
}

export interface SteamGameMetadata {
  steamAppId: number;
  igdbId: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: SteamGameGenreMetadata[];
}

export interface SteamGameMetadataGateway {
  getBySteamAppIds(steamAppIds: number[]): Promise<SteamGameMetadata[]>;
}
