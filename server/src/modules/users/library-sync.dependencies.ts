import { IgdbClient } from "../../integrations/igdb/igdb.client";
import { InMemorySteamGameMetadataGateway } from "../../integrations/igdb/in-memory-steam-game-metadata.gateway";
import { SteamWebApiClient } from "../../integrations/steam/steam-web-api.client";
import {
  getGamesCatalogProvider,
  getIgdbCredentials,
  getSteamConfig
} from "../../shared/config/runtime-env";
import { LibrarySyncService } from "./library-sync.service";
import { usersRepository } from "./users.dependencies";

const steamLibraryGateway = new SteamWebApiClient(getSteamConfig().apiKey);
const steamGameMetadataGateway =
  getGamesCatalogProvider() === "igdb"
    ? new IgdbClient(getIgdbCredentials())
    : new InMemorySteamGameMetadataGateway();
const librarySyncService = new LibrarySyncService(
  steamLibraryGateway,
  steamGameMetadataGateway,
  usersRepository
);

export { librarySyncService };
