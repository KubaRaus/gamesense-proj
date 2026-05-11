import type { CompatibilityResponse } from "@gamesense/types";
import type { CompatibilityParams } from "./compatibility.schemas";
import { getMockUserGenreSet } from "../users/users.mock";

export class CompatibilityService {
  async getCompatibility(params: CompatibilityParams): Promise<CompatibilityResponse | null> {
    const genresA = getMockUserGenreSet(params.userA);
    const genresB = getMockUserGenreSet(params.userB);
    if (!genresA || !genresB) {
      return null;
    }

    const sharedGenres = [...genresA].filter((genre) => genresB.has(genre)).sort();
    const uniqueToA = [...genresA].filter((genre) => !genresB.has(genre)).sort();
    const uniqueToB = [...genresB].filter((genre) => !genresA.has(genre)).sort();

    const unionCount = new Set([...genresA, ...genresB]).size;
    const intersectionCount = sharedGenres.length;
    const overlapIndex = unionCount === 0 ? 0 : Number((intersectionCount / unionCount).toFixed(2));

    return {
      userA: params.userA,
      userB: params.userB,
      overlapIndex,
      sharedGenres,
      uniqueToA,
      uniqueToB,
      debug: {
        intersectionCount,
        unionCount
      }
    };
  }
}
