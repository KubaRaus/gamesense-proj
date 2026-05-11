import type { CompatibilityResponse } from "@gamesense/types";
import type { CompatibilityParams } from "./compatibility.schemas";

export class CompatibilityService {
  async getCompatibility(params: CompatibilityParams): Promise<CompatibilityResponse> {
    return {
      userA: params.userA,
      userB: params.userB,
      overlapIndex: 0,
      sharedGenres: [],
      uniqueToA: [],
      uniqueToB: [],
      debug: {
        intersectionCount: 0,
        unionCount: 0
      }
    };
  }
}
