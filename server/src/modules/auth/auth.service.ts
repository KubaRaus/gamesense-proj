import type { AuthSteamCallbackResponse } from "@gamesense/types";
import type { SteamCallbackBody } from "./auth.schemas";

export class AuthService {
  async handleSteamCallback(_payload: SteamCallbackBody): Promise<AuthSteamCallbackResponse> {
    // Prototype response without Steam/OpenID business flow.
    return {
      accessToken: "prototype-token",
      expiresIn: 3600,
      user: {
        id: "usr_prototype",
        steamId: "76561190000000000",
        username: "PrototypeUser",
        avatarUrl: null
      }
    };
  }
}
