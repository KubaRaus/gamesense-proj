import { IgdbClient } from "../../integrations/igdb/igdb.client";
import { InMemoryGamesCatalogGateway } from "../../integrations/igdb/in-memory-games-catalog.gateway";
import {
  getGamesCatalogProvider,
  getIgdbCredentials
} from "../../shared/config/runtime-env";
import type { GamesCatalogGateway } from "./games-catalog.gateway";
import { GamesService } from "./games.service";

function createGamesCatalogGateway(): GamesCatalogGateway {
  return getGamesCatalogProvider() === "igdb"
    ? new IgdbClient(getIgdbCredentials())
    : new InMemoryGamesCatalogGateway();
}

const gamesCatalogGateway = createGamesCatalogGateway();
const gamesService = new GamesService(gamesCatalogGateway);

export { gamesService };
