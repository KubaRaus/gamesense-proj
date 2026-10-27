export interface AuthSteamExchangeRequest {
  code: string;
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
  overlapPercentage: number;
  presenceOverlapIndex: number;
  method: "weighted-jaccard-playtime";
  sharedGenres: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  commonGames: Array<{
    gameId: string;
    name: string;
    userAPlaytimeMinutes: number;
    userBPlaytimeMinutes: number;
  }>;
  genreBreakdown: Array<{
    genre: string;
    userAWeight: number;
    userBWeight: number;
  }>;
  debug: {
    intersectionCount: number;
    unionCount: number;
    weightedIntersection: number;
    weightedUnion: number;
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
