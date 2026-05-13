import type { UsersRepository } from "./users.repository";
import type { UserRecord } from "./users.types";

const IN_MEMORY_USERS: UserRecord[] = [
  {
    id: "usr_1",
    steamId: "76561190000000001",
    username: "Jakub",
    avatarUrl: null,
    games: [
      {
        gameId: "game_7346",
        name: "Elden Ring",
        genres: ["RPG", "Action"],
        playtimeMinutes: 4200,
        lastPlayedAt: "2026-05-10T14:00:00.000Z"
      },
      {
        gameId: "game_22511",
        name: "Hades",
        genres: ["Action", "Roguelike"],
        playtimeMinutes: 1900,
        lastPlayedAt: "2026-05-09T16:30:00.000Z"
      }
    ]
  },
  {
    id: "usr_2",
    steamId: "76561190000000002",
    username: "Marta",
    avatarUrl: null,
    games: [
      {
        gameId: "game_7346",
        name: "Elden Ring",
        genres: ["RPG", "Action"],
        playtimeMinutes: 2750,
        lastPlayedAt: "2026-05-11T11:20:00.000Z"
      },
      {
        gameId: "game_1020",
        name: "Portal 2",
        genres: ["Puzzle", "Adventure"],
        playtimeMinutes: 860,
        lastPlayedAt: "2026-05-08T19:45:00.000Z"
      }
    ]
  }
];

export class InMemoryUsersRepository implements UsersRepository {
  async findById(userId: string): Promise<UserRecord | null> {
    return IN_MEMORY_USERS.find((user) => user.id === userId) ?? null;
  }

  async getGenreSet(userId: string): Promise<Set<string> | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    return new Set(user.games.flatMap((game) => game.genres));
  }
}
