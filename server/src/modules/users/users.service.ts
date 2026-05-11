import type { UserProfileResponse } from "@gamesense/types";
import type { UserProfileParams } from "./users.schemas";

export class UsersService {
  async getProfile(params: UserProfileParams): Promise<UserProfileResponse> {
    return {
      id: params.userId,
      steamId: "76561190000000000",
      username: "PrototypeUser",
      avatarUrl: null,
      totalPlaytimeMinutes: 0,
      gameCount: 0,
      topGenres: [],
      recentGames: []
    };
  }
}
