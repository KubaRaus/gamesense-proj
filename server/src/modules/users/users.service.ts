import type { UserProfileResponse } from "@gamesense/types";
import type { UsersRepository } from "./users.repository";
import type { GetUserProfileQuery } from "./users.use-cases";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getProfile(query: GetUserProfileQuery): Promise<UserProfileResponse | null> {
    const user = await this.usersRepository.findById(query.userId);
    if (!user) {
      return null;
    }

    const totalPlaytimeMinutes = user.games.reduce((sum, game) => sum + game.playtimeMinutes, 0);
    const genrePlaytime = new Map<string, number>();

    for (const game of user.games) {
      for (const genre of game.genres) {
        genrePlaytime.set(genre, (genrePlaytime.get(genre) ?? 0) + game.playtimeMinutes);
      }
    }

    const topGenres = [...genrePlaytime.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, playtimeMinutes]) => ({ name, playtimeMinutes }));

    const recentGames = [...user.games]
      .sort((a, b) => (b.lastPlayedAt ?? "").localeCompare(a.lastPlayedAt ?? ""))
      .slice(0, 5)
      .map((game) => ({
        gameId: game.gameId,
        name: game.name,
        playtimeMinutes: game.playtimeMinutes,
        lastPlayedAt: game.lastPlayedAt
      }));

    return {
      id: user.id,
      steamId: user.steamId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      totalPlaytimeMinutes,
      gameCount: user.games.length,
      topGenres,
      recentGames
    };
  }
}
