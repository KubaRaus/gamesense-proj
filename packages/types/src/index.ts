export interface AuthSteamCallbackRequest {
  openIdResponse: string;
}

export interface UserProfileResponse {
  id: string;
  steamId: string;
  username: string;
  avatarUrl: string | null;
  totalPlaytimeMinutes: number;
  gameCount: number;
}

export interface CompatibilityResponse {
  userA: string;
  userB: string;
  overlapIndex: number;
  sharedGenres: string[];
  uniqueToA: string[];
  uniqueToB: string[];
}
