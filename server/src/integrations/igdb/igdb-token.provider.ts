import type { IgdbAccessToken, IgdbCredentials } from "./igdb.types";

interface TwitchTokenResponse {
  access_token?: string;
  expires_in?: number;
}

const TOKEN_EXPIRY_SAFETY_WINDOW_MS = 60_000;

export class IgdbTokenProvider {
  private cachedToken: IgdbAccessToken | null = null;

  constructor(
    private readonly credentials: IgdbCredentials,
    private readonly fetchFn: typeof fetch = fetch
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.accessToken;
    }

    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      grant_type: "client_credentials"
    });

    const response = await this.fetchFn(`https://id.twitch.tv/oauth2/token?${params}`, {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(`IGDB authentication failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as TwitchTokenResponse;
    if (!payload.access_token || !payload.expires_in) {
      throw new Error("IGDB authentication returned an invalid response.");
    }

    this.cachedToken = {
      accessToken: payload.access_token,
      expiresAt: Date.now() + payload.expires_in * 1000 - TOKEN_EXPIRY_SAFETY_WINDOW_MS
    };

    return this.cachedToken.accessToken;
  }
}
