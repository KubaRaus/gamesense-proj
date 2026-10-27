import type { Prisma, PrismaClient } from "@prisma/client";
import type { LibrarySyncRepository } from "./library-sync.repository";
import type { SteamGameMetadata } from "./steam-game-metadata.gateway";
import type {
  SteamOwnedGame,
  SteamPlayerProfile
} from "./steam-library.gateway";
import type { UsersRepository } from "./users.repository";
import type { UserRecord } from "./users.types";

type UserWithGames = Prisma.UserGetPayload<{
  include: {
    games: {
      include: {
        game: {
          include: {
            genres: {
              include: {
                genre: true;
              };
            };
          };
        };
      };
    };
  };
}>;

function mapUser(user: UserWithGames): UserRecord {
  return {
    id: user.id,
    steamId: user.steamId,
    username: user.username,
    avatarUrl: user.avatarUrl,
    games: user.games.map((userGame) => ({
      gameId: userGame.game.id,
      name: userGame.game.name,
      genres: userGame.game.genres.map(({ genre }) => genre.name),
      playtimeMinutes: userGame.playtimeMinutes,
      lastPlayedAt: userGame.lastPlayedAt?.toISOString() ?? null
    }))
  };
}

export class PrismaUsersRepository
  implements UsersRepository, LibrarySyncRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        games: {
          include: {
            game: {
              include: {
                genres: {
                  include: {
                    genre: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return user ? mapUser(user) : null;
  }

  async synchronize(
    profile: SteamPlayerProfile,
    games: SteamOwnedGame[],
    metadata: SteamGameMetadata[]
  ): Promise<UserRecord> {
    const metadataBySteamAppId = new Map(
      metadata.map((game) => [game.steamAppId, game])
    );
    const now = new Date();

    const userId = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { steamId: profile.steamId },
        create: {
          steamId: profile.steamId,
          username: profile.username,
          avatarUrl: profile.avatarUrl
        },
        update: {
          username: profile.username,
          avatarUrl: profile.avatarUrl
        }
      });
      const synchronizedGameIds: string[] = [];

      for (const steamGame of games) {
        const gameMetadata = metadataBySteamAppId.get(steamGame.steamAppId);
        const existingGame = await tx.game.findFirst({
          where: {
            OR: [
              { steamAppId: steamGame.steamAppId },
              ...(gameMetadata ? [{ igdbId: gameMetadata.igdbId }] : [])
            ]
          }
        });

        const game = existingGame
          ? await tx.game.update({
              where: { id: existingGame.id },
              data: {
                steamAppId: steamGame.steamAppId,
                igdbId: gameMetadata?.igdbId,
                name: gameMetadata?.name ?? steamGame.name,
                coverUrl: gameMetadata?.coverUrl,
                releaseYear: gameMetadata?.releaseYear
              }
            })
          : await tx.game.create({
              data: {
                steamAppId: steamGame.steamAppId,
                igdbId: gameMetadata?.igdbId,
                name: gameMetadata?.name ?? steamGame.name,
                coverUrl: gameMetadata?.coverUrl ?? null,
                releaseYear: gameMetadata?.releaseYear ?? null
              }
            });

        synchronizedGameIds.push(game.id);

        if (gameMetadata) {
          const synchronizedGenreIds: string[] = [];
          for (const genreMetadata of gameMetadata.genres) {
            const existingGenre = await tx.genre.findFirst({
              where: {
                OR: [
                  { igdbGenreId: genreMetadata.igdbGenreId },
                  { name: genreMetadata.name }
                ]
              }
            });
            const genre = existingGenre
              ? await tx.genre.update({
                  where: { id: existingGenre.id },
                  data: {
                    igdbGenreId: genreMetadata.igdbGenreId,
                    name: genreMetadata.name
                  }
                })
              : await tx.genre.create({
                  data: {
                    igdbGenreId: genreMetadata.igdbGenreId,
                    name: genreMetadata.name
                  }
                });

            synchronizedGenreIds.push(genre.id);
            await tx.gameGenre.upsert({
              where: {
                gameId_genreId: {
                  gameId: game.id,
                  genreId: genre.id
                }
              },
              create: {
                gameId: game.id,
                genreId: genre.id
              },
              update: {}
            });
          }

          await tx.gameGenre.deleteMany({
            where:
              synchronizedGenreIds.length === 0
                ? { gameId: game.id }
                : {
                    gameId: game.id,
                    genreId: {
                      notIn: synchronizedGenreIds
                    }
                  }
          });
        }

        await tx.userGame.upsert({
          where: {
            userId_gameId: {
              userId: user.id,
              gameId: game.id
            }
          },
          create: {
            userId: user.id,
            gameId: game.id,
            playtimeMinutes: steamGame.playtimeMinutes,
            lastPlayedAt: steamGame.lastPlayedAt,
            lastSyncedAt: now
          },
          update: {
            playtimeMinutes: steamGame.playtimeMinutes,
            lastPlayedAt: steamGame.lastPlayedAt,
            lastSyncedAt: now
          }
        });
      }

      if (synchronizedGameIds.length === 0) {
        await tx.userGame.deleteMany({ where: { userId: user.id } });
      } else {
        await tx.userGame.deleteMany({
          where: {
            userId: user.id,
            gameId: {
              notIn: synchronizedGameIds
            }
          }
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: { lastLibrarySyncAt: now }
      });

      return user.id;
    });

    const synchronizedUser = await this.findById(userId);
    if (!synchronizedUser) {
      throw new Error("Synchronized Steam user could not be loaded.");
    }

    return synchronizedUser;
  }
}
