export interface SteamPlayerProfile {
  steamId: string;
  username: string;
  avatarUrl: string | null;
}

export interface SteamOwnedGame {
  steamAppId: number;
  name: string;
  playtimeMinutes: number;
  lastPlayedAt: Date | null;
}

export interface SteamLibraryGateway {
  getPlayerProfile(steamId: string): Promise<SteamPlayerProfile>;
  getOwnedGames(steamId: string): Promise<SteamOwnedGame[]>;
}
