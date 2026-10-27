export type SteamOpenIdCallback = Record<string, string | undefined>;

export interface SteamAuthGateway {
  createAuthenticationUrl(returnToUrl: string, realm: string): string;
  validateCallback(
    callback: SteamOpenIdCallback,
    expectedReturnToUrl: string
  ): Promise<string>;
}
