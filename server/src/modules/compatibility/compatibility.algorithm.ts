import type { UserLibraryGame } from "../users/users.types";

export interface GenreTasteWeight {
  genre: string;
  weight: number;
}

export interface WeightedJaccardResult {
  score: number;
  weightedIntersection: number;
  weightedUnion: number;
}

export function buildGenreTasteProfile(games: UserLibraryGame[]): Map<string, number> {
  const rawWeights = new Map<string, number>();

  for (const game of games) {
    const genres = [...new Set(game.genres.map((genre) => genre.trim()).filter(Boolean))];
    if (genres.length === 0) {
      continue;
    }

    const gameWeight = Math.max(0, game.playtimeMinutes);
    const weightPerGenre = gameWeight / genres.length;

    for (const genre of genres) {
      rawWeights.set(genre, (rawWeights.get(genre) ?? 0) + weightPerGenre);
    }
  }

  const totalWeight = [...rawWeights.values()].reduce((sum, weight) => sum + weight, 0);
  if (totalWeight > 0) {
    return new Map(
      [...rawWeights.entries()].map(([genre, weight]) => [genre, weight / totalWeight])
    );
  }

  const genreCount = rawWeights.size;
  if (genreCount === 0) {
    return rawWeights;
  }

  return new Map([...rawWeights.keys()].map((genre) => [genre, 1 / genreCount]));
}

export function calculateWeightedJaccard(
  profileA: ReadonlyMap<string, number>,
  profileB: ReadonlyMap<string, number>
): WeightedJaccardResult {
  const genres = new Set([...profileA.keys(), ...profileB.keys()]);
  let weightedIntersection = 0;
  let weightedUnion = 0;

  for (const genre of genres) {
    const weightA = profileA.get(genre) ?? 0;
    const weightB = profileB.get(genre) ?? 0;
    weightedIntersection += Math.min(weightA, weightB);
    weightedUnion += Math.max(weightA, weightB);
  }

  const score = weightedUnion === 0 ? 0 : weightedIntersection / weightedUnion;

  return {
    score,
    weightedIntersection,
    weightedUnion
  };
}
