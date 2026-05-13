import type { CompatibilityResponse } from "@gamesense/types";
import type { UsersRepository } from "../users/users.repository";
import type { GetCompatibilityQuery } from "./compatibility.use-cases";

export class CompatibilityService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCompatibility(query: GetCompatibilityQuery): Promise<CompatibilityResponse | null> {
    const genresA = await this.usersRepository.getGenreSet(query.userA);
    const genresB = await this.usersRepository.getGenreSet(query.userB);
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
      userA: query.userA,
      userB: query.userB,
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
