import type { SteamGameMetadata } from "./steam-game-metadata.gateway";
import type {
  SteamOwnedGame,
  SteamPlayerProfile
} from "./steam-library.gateway";
import type { UserRecord } from "./users.types";

export interface LibrarySyncRepository {
  synchronize(
    profile: SteamPlayerProfile,
    games: SteamOwnedGame[],
    metadata: SteamGameMetadata[]
  ): Promise<UserRecord>;
}
