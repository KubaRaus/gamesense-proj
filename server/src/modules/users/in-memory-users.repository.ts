import type { LibrarySyncRepository } from "./library-sync.repository";
import type { SteamGameMetadata } from "./steam-game-metadata.gateway";
import type {
  SteamOwnedGame,
  SteamPlayerProfile
} from "./steam-library.gateway";
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

export class InMemoryUsersRepository
  implements UsersRepository, LibrarySyncRepository
{
  async findById(userId: string): Promise<UserRecord | null> {
    return IN_MEMORY_USERS.find((user) => user.id === userId) ?? null;
  }

  async synchronize(
    profile: SteamPlayerProfile,
    games: SteamOwnedGame[],
    metadata: SteamGameMetadata[]
  ): Promise<UserRecord> {
    const metadataByAppId = new Map(
      metadata.map((game) => [game.steamAppId, game])
    );
    const synchronizedGames = games.map((game) => {
      const gameMetadata = metadataByAppId.get(game.steamAppId);
      return {
        gameId: gameMetadata
          ? `game_${gameMetadata.igdbId}`
          : `steam_${game.steamAppId}`,
        name: gameMetadata?.name ?? game.name,
        genres: gameMetadata?.genres.map((genre) => genre.name) ?? [],
        playtimeMinutes: game.playtimeMinutes,
        lastPlayedAt: game.lastPlayedAt?.toISOString() ?? null
      };
    });
    const existingUser = IN_MEMORY_USERS.find(
      (user) => user.steamId === profile.steamId
    );

    if (existingUser) {
      existingUser.username = profile.username;
      existingUser.avatarUrl = profile.avatarUrl;
      existingUser.games = synchronizedGames;
      return existingUser;
    }

    const user: UserRecord = {
      id: `usr_${profile.steamId}`,
      steamId: profile.steamId,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      games: synchronizedGames
    };
    IN_MEMORY_USERS.push(user);
    return user;
  }
}
