import type { CompatibilityResponse } from "@gamesense/types";
import type { CompatibilityParams } from "./compatibility.schemas";
import type { UsersRepository } from "../users/users.repository";
import { InMemoryUsersRepository } from "../users/in-memory-users.repository";

export class CompatibilityService {
  constructor(private readonly usersRepository: UsersRepository = new InMemoryUsersRepository()) {}

  async getCompatibility(params: CompatibilityParams): Promise<CompatibilityResponse | null> {
    const genresA = await this.usersRepository.getGenreSet(params.userA);
    const genresB = await this.usersRepository.getGenreSet(params.userB);
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
