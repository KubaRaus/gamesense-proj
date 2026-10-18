import type { CompatibilityResponse } from "@gamesense/types";
import type { UsersRepository } from "../users/users.repository";
import type { GetCompatibilityQuery } from "./compatibility.use-cases";
import {
  buildGenreTasteProfile,
  calculateWeightedJaccard
} from "./compatibility.algorithm";

function round(value: number, precision = 4): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

export class CompatibilityService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCompatibility(query: GetCompatibilityQuery): Promise<CompatibilityResponse | null> {
    const [userA, userB] = await Promise.all([
      this.usersRepository.findById(query.userA),
      this.usersRepository.findById(query.userB)
    ]);
    if (!userA || !userB) {
      return null;
    }

    const profileA = buildGenreTasteProfile(userA.games);
    const profileB = buildGenreTasteProfile(userB.games);
    const genresA = new Set(profileA.keys());
    const genresB = new Set(profileB.keys());
    const sharedGenres = [...genresA].filter((genre) => genresB.has(genre)).sort();
    const uniqueToA = [...genresA].filter((genre) => !genresB.has(genre)).sort();
    const uniqueToB = [...genresB].filter((genre) => !genresA.has(genre)).sort();

    const unionCount = new Set([...genresA, ...genresB]).size;
    const intersectionCount = sharedGenres.length;
    const presenceOverlapIndex = unionCount === 0 ? 0 : intersectionCount / unionCount;
    const weightedResult = calculateWeightedJaccard(profileA, profileB);
    const overlapIndex = round(weightedResult.score);

    const gamesB = new Map(userB.games.map((game) => [game.gameId, game]));
    const commonGames = userA.games
      .filter((game) => gamesB.has(game.gameId))
      .map((game) => ({
        gameId: game.gameId,
        name: game.name,
        userAPlaytimeMinutes: game.playtimeMinutes,
        userBPlaytimeMinutes: gamesB.get(game.gameId)?.playtimeMinutes ?? 0
      }))
      .sort(
        (a, b) =>
          b.userAPlaytimeMinutes +
          b.userBPlaytimeMinutes -
          (a.userAPlaytimeMinutes + a.userBPlaytimeMinutes)
      );

    const genreBreakdown = [...new Set([...genresA, ...genresB])]
      .sort()
      .map((genre) => ({
        genre,
        userAWeight: round(profileA.get(genre) ?? 0),
        userBWeight: round(profileB.get(genre) ?? 0)
      }));

    return {
      userA: query.userA,
      userB: query.userB,
      overlapIndex,
      overlapPercentage: Math.round(overlapIndex * 100),
      presenceOverlapIndex: round(presenceOverlapIndex),
      method: "weighted-jaccard-playtime",
      sharedGenres,
      uniqueToA,
      uniqueToB,
      commonGames,
      genreBreakdown,
      debug: {
        intersectionCount,
        unionCount,
        weightedIntersection: round(weightedResult.weightedIntersection),
        weightedUnion: round(weightedResult.weightedUnion)
      }
    };
  }
}
