import type { SteamOpenIdCallback } from "./steam-auth.gateway";

export interface CompleteSteamLoginCommand {
  state: string;
  callback: SteamOpenIdCallback;
}

export interface ExchangeSteamAuthCodeCommand {
  code: string;
}
