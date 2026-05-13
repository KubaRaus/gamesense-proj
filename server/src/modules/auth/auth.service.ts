import type { AuthSteamCallbackResponse } from "@gamesense/types";
import { ACCESS_TOKEN_EXPIRES_IN_SECONDS, signAccessToken } from "../../shared/auth/jwt";
import type { CompleteSteamCallbackCommand } from "./auth.use-cases";

export class AuthService {
  async handleSteamCallback(_command: CompleteSteamCallbackCommand): Promise<AuthSteamCallbackResponse> {
    const prototypeUser = {
      id: "usr_prototype",
      steamId: "76561190000000000",
      username: "PrototypeUser",
      avatarUrl: null
    };

    const accessToken = signAccessToken({
      sub: prototypeUser.id,
      steamId: prototypeUser.steamId,
      username: prototypeUser.username
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      user: prototypeUser
    };
  }
}
