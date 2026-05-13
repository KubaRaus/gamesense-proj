import { IgdbClient } from "../../integrations/igdb/igdb.client";
import { GamesService } from "./games.service";

const gamesCatalogGateway = new IgdbClient();
const gamesService = new GamesService(gamesCatalogGateway);

export { gamesService };
