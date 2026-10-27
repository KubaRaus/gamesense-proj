import type { AuthSteamCallbackResponse } from "@gamesense/types";
import { ACCESS_TOKEN_EXPIRES_IN_SECONDS, signAccessToken } from "../../shared/auth/jwt";
import type { LibrarySyncService } from "../users/library-sync.service";
import type { AuthCodeRepository } from "./auth-code.repository";
import type { SteamAuthGateway } from "./steam-auth.gateway";
import type {
  CompleteSteamLoginCommand,
  ExchangeSteamAuthCodeCommand
} from "./auth.use-cases";

interface AuthServiceConfig {
  serverPublicUrl: string;
}

export class AuthService {
  constructor(
    private readonly steamAuthGateway: SteamAuthGateway,
    private readonly librarySyncService: LibrarySyncService,
    private readonly authCodeRepository: AuthCodeRepository,
    private readonly config: AuthServiceConfig
  ) {}

  createSteamAuthenticationUrl(state: string): string {
    return this.steamAuthGateway.createAuthenticationUrl(
      this.createReturnToUrl(state),
      this.config.serverPublicUrl
    );
  }

  async completeSteamLogin(command: CompleteSteamLoginCommand): Promise<string> {
    const steamId = await this.steamAuthGateway.validateCallback(
      command.callback,
      this.createReturnToUrl(command.state)
    );
    const user = await this.librarySyncService.synchronize(steamId);
    return this.authCodeRepository.create(user.id);
  }

  async exchangeSteamAuthCode(
    command: ExchangeSteamAuthCodeCommand
  ): Promise<AuthSteamCallbackResponse | null> {
    const user = await this.authCodeRepository.consume(command.code);
    if (!user) {
      return null;
    }

    const accessToken = signAccessToken({
      sub: user.id,
      steamId: user.steamId,
      username: user.username
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      user
    };
  }

  private createReturnToUrl(state: string): string {
    const returnToUrl = new URL(
      "/api/auth/steam/callback",
      this.config.serverPublicUrl
    );
    returnToUrl.searchParams.set("state", state);
    return returnToUrl.toString();
  }
}
