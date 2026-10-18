import type {
  CatalogGame,
  GamesCatalogGateway
} from "../../modules/games/games-catalog.gateway";
import type { IgdbApiGame, IgdbCredentials } from "./igdb.types";
import { IgdbTokenProvider } from "./igdb-token.provider";

interface AccessTokenProvider {
  getAccessToken(): Promise<string>;
}

const IGDB_GAMES_URL = "https://api.igdb.com/v4/games";
const IGDB_COVER_URL = "https://images.igdb.com/igdb/image/upload/t_cover_big";

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

export class IgdbClient implements GamesCatalogGateway {
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
    const accessToken = await this.tokenProvider.getAccessToken();
    const body = [
      `search "${escapeApicalypseSearch(query)}"`,
      "fields id,name,first_release_date,cover.image_id,genres.name",
      `limit ${limit}`
    ].join("; ") + ";";

    const response = await this.fetchFn(IGDB_GAMES_URL, {
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
      throw new Error("IGDB games request returned an invalid response.");
    }

    return (payload as IgdbApiGame[]).map(mapGame);
  }
}
