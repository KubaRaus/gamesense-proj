import type {
  CatalogGame,
  GamesCatalogGateway
} from "../../modules/games/games-catalog.gateway";
import type {
  SteamGameMetadata,
  SteamGameMetadataGateway
} from "../../modules/users/steam-game-metadata.gateway";
import type {
  IgdbApiGame,
  IgdbCredentials,
  IgdbExternalGame
} from "./igdb.types";
import { IgdbTokenProvider } from "./igdb-token.provider";

interface AccessTokenProvider {
  getAccessToken(): Promise<string>;
}

const IGDB_GAMES_URL = "https://api.igdb.com/v4/games";
const IGDB_EXTERNAL_GAMES_URL = "https://api.igdb.com/v4/external_games";
const IGDB_COVER_URL = "https://images.igdb.com/igdb/image/upload/t_cover_big";
const STEAM_EXTERNAL_GAME_SOURCE = 1;
const IGDB_BATCH_SIZE = 500;

function escapeApicalypseSearch(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function toReleaseYear(timestamp?: number): number | null {
  return timestamp ? new Date(timestamp * 1000).getUTCFullYear() : null;
}

function mapGame(game: IgdbApiGame): CatalogGame {
  const imageId = game.cover?.image_id;

  return {
    igdbId: game.id,
    name: game.name,
    coverUrl: imageId ? `${IGDB_COVER_URL}/${imageId}.jpg` : null,
    releaseYear: toReleaseYear(game.first_release_date),
    genres: (game.genres ?? [])
      .map((genre) => genre.name)
      .filter((name): name is string => Boolean(name))
  };
}

export class IgdbClient implements GamesCatalogGateway, SteamGameMetadataGateway {
  private readonly tokenProvider: AccessTokenProvider;

  constructor(
    private readonly credentials: IgdbCredentials,
    tokenProvider?: AccessTokenProvider,
    private readonly fetchFn: typeof fetch = fetch
  ) {
    this.tokenProvider =
      tokenProvider ?? new IgdbTokenProvider(credentials, fetchFn);
  }

  async searchGames(query: string, limit: number): Promise<CatalogGame[]> {
    const body = [
      `search "${escapeApicalypseSearch(query)}"`,
      "fields id,name,first_release_date,cover.image_id,genres.name",
      `limit ${limit}`
    ].join("; ") + ";";
    const payload = await this.post<IgdbApiGame[]>(IGDB_GAMES_URL, body);

    return payload.map(mapGame);
  }

  async getBySteamAppIds(steamAppIds: number[]): Promise<SteamGameMetadata[]> {
    const uniqueAppIds = [...new Set(steamAppIds)].filter(Number.isInteger);
    const results: SteamGameMetadata[] = [];

    for (let index = 0; index < uniqueAppIds.length; index += IGDB_BATCH_SIZE) {
      const batch = uniqueAppIds.slice(index, index + IGDB_BATCH_SIZE);
      const quotedAppIds = batch.map((appId) => `"${appId}"`).join(",");
      const body = [
        `fields uid,game.id,game.name,game.first_release_date,game.cover.image_id,game.genres.id,game.genres.name`,
        `where external_game_source = ${STEAM_EXTERNAL_GAME_SOURCE} & uid = (${quotedAppIds})`,
        `limit ${IGDB_BATCH_SIZE}`
      ].join("; ") + ";";
      const externalGames = await this.post<IgdbExternalGame[]>(
        IGDB_EXTERNAL_GAMES_URL,
        body
      );

      for (const externalGame of externalGames) {
        const steamAppId = Number(externalGame.uid);
        const game = externalGame.game;
        if (!Number.isInteger(steamAppId) || !game?.id || !game.name) {
          continue;
        }

        const imageId = game.cover?.image_id;
        results.push({
          steamAppId,
          igdbId: game.id,
          name: game.name,
          coverUrl: imageId ? `${IGDB_COVER_URL}/${imageId}.jpg` : null,
          releaseYear: toReleaseYear(game.first_release_date),
          genres: (game.genres ?? [])
            .filter(
              (genre): genre is { id: number; name: string } =>
                typeof genre.id === "number" && typeof genre.name === "string"
            )
            .map((genre) => ({
              igdbGenreId: genre.id,
              name: genre.name
            }))
        });
      }
    }

    return results;
  }

  private async post<T>(url: string, body: string): Promise<T> {
    const accessToken = await this.tokenProvider.getAccessToken();
    const response = await this.fetchFn(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": this.credentials.clientId,
        "Content-Type": "text/plain"
      },
      body
    });

    if (!response.ok) {
      throw new Error(`IGDB games request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      throw new Error("IGDB request returned an invalid response.");
    }

    return payload as T;
  }
}
