export interface AuthSteamCallbackRequest {
  openIdResponse: string;
}

export interface AuthSteamCallbackResponse {
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    steamId: string;
    username: string;
    avatarUrl: string | null;
  };
}

export interface UserProfileResponse {
  id: string;
  steamId: string;
  username: string;
  avatarUrl: string | null;
  totalPlaytimeMinutes: number;
  gameCount: number;
  topGenres: Array<{
    name: string;
    playtimeMinutes: number;
  }>;
  recentGames: Array<{
    gameId: string;
    name: string;
    playtimeMinutes: number;
    lastPlayedAt: string | null;
  }>;
}

export interface CompatibilityResponse {
  userA: string;
  userB: string;
  overlapIndex: number;
  sharedGenres: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  debug: {
    intersectionCount: number;
    unionCount: number;
  };
}

export interface GameSearchItem {
  id: string;
  igdbId: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: string[];
}

export interface GameSearchResponse {
  query: string;
  total: number;
  items: GameSearchItem[];
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}
