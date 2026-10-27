export interface SteamPlayerSummaryApiResponse {
  response?: {
    players?: Array<{
      steamid?: string;
      personaname?: string;
      avatarfull?: string;
    }>;
  };
}

export interface SteamOwnedGamesApiResponse {
  response?: {
    game_count?: number;
    games?: Array<{
      appid?: number;
      name?: string;
      playtime_forever?: number;
      rtime_last_played?: number;
    }>;
  };
}
