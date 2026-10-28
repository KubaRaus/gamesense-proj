import type {
  SteamLibraryGateway,
  SteamOwnedGame,
  SteamPlayerProfile
} from "../../modules/users/steam-library.gateway";
import type {
  SteamOwnedGamesApiResponse,
  SteamPlayerSummaryApiResponse
} from "./steam.types";

const STEAM_API_URL = "https://api.steampowered.com";

function unixTimestampToDate(timestamp?: number): Date | null {
  return timestamp && timestamp > 0 ? new Date(timestamp * 1000) : null;
}

export class SteamWebApiClient implements SteamLibraryGateway {
  constructor(
    private readonly apiKey: string,
    private readonly fetchFn: typeof fetch = fetch
  ) {}

  async getPlayerProfile(steamId: string): Promise<SteamPlayerProfile> {
    const params = new URLSearchParams({
      key: this.apiKey,
      steamids: steamId
    });
    const payload = await this.getJson<SteamPlayerSummaryApiResponse>(
      `${STEAM_API_URL}/ISteamUser/GetPlayerSummaries/v0002/?${params}`
    );
    const player = payload.response?.players?.[0];

    if (!player?.steamid || !player.personaname) {
      throw new Error("Steam player profile is unavailable.");
    }

    return {
      steamId: player.steamid,
      username: player.personaname,
      avatarUrl: player.avatarfull || null
    };
  }

 async getOwnedGames(steamId: string): Promise<SteamOwnedGame[]> {
    const params = new URLSearchParams({
      key: this.apiKey,
      steamid: steamId,
      include_appinfo: "true",
      include_played_free_games: "true",
      format: "json"
    });
    const payload = await this.getJson<SteamOwnedGamesApiResponse>(
      `${STEAM_API_URL}/IPlayerService/GetOwnedGames/v0001/?${params}`
    );
    const library = payload.response;

    if (!library || (library.game_count === undefined && !library.games)) {
      throw new Error("Steam library is private or unavailable.");
    }

    return (library.games ?? [])
      .filter((game): game is typeof game & { appid: number } => typeof game.appid === "number")
      .map((game) => ({
        steamAppId: game.appid,
        name: game.name && typeof game.name === "string" ? game.name : `Steam Game ${game.appid}`,
        playtimeMinutes: Math.max(0, game.playtime_forever ?? 0),
        lastPlayedAt: unixTimestampToDate(game.rtime_last_played),
        // Dodajemy bezpośredni link do okładki Steam CDN
        coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`
      }));
  }

  private async getJson<T>(url: string): Promise<T> {
    const response = await this.fetchFn(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Steam Web API request failed with status ${response.status}.`);
    }

    return (await response.json()) as T;
  }
}
