import type {
  SteamGameMetadata,
  SteamGameMetadataGateway
} from "../../modules/users/steam-game-metadata.gateway";

const METADATA: SteamGameMetadata[] = [
  {
    steamAppId: 1245620,
    igdbId: 119133,
    name: "Elden Ring",
    coverUrl: null,
    releaseYear: 2022,
    genres: [
      { igdbGenreId: 12, name: "Role-playing (RPG)" },
      { igdbGenreId: 31, name: "Adventure" }
    ]
  },
  {
    steamAppId: 620,
    igdbId: 1020,
    name: "Portal 2",
    coverUrl: null,
    releaseYear: 2011,
    genres: [
      { igdbGenreId: 9, name: "Puzzle" },
      { igdbGenreId: 31, name: "Adventure" }
    ]
  }
];

export class InMemorySteamGameMetadataGateway
  implements SteamGameMetadataGateway
{
  async getBySteamAppIds(steamAppIds: number[]): Promise<SteamGameMetadata[]> {
    const requestedIds = new Set(steamAppIds);
    return METADATA.filter((game) => requestedIds.has(game.steamAppId));
  }
}
