import type { LibrarySyncRepository } from "./library-sync.repository";
import type {
  SteamGameMetadata,
  SteamGameMetadataGateway
} from "./steam-game-metadata.gateway";
import type { SteamLibraryGateway } from "./steam-library.gateway";
import type { UserRecord } from "./users.types";

export class LibrarySyncService {
  constructor(
    private readonly steamLibraryGateway: SteamLibraryGateway,
    private readonly metadataGateway: SteamGameMetadataGateway,
    private readonly librarySyncRepository: LibrarySyncRepository
  ) {}

  async synchronize(steamId: string): Promise<UserRecord> {
    const [profile, games] = await Promise.all([
      this.steamLibraryGateway.getPlayerProfile(steamId),
      this.steamLibraryGateway.getOwnedGames(steamId)
    ]);

    let metadata: SteamGameMetadata[] = [];
    try {
      metadata = await this.metadataGateway.getBySteamAppIds(
        games.map((game) => game.steamAppId)
      );
    } catch {
      // Steam remains the source of truth. IGDB enrichment can be retried later.
      metadata = [];
    }

    return this.librarySyncRepository.synchronize(profile, games, metadata);
  }
}
