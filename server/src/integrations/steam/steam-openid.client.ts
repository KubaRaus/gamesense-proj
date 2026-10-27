import type {
  SteamAuthGateway,
  SteamOpenIdCallback
} from "../../modules/auth/steam-auth.gateway";

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const OPENID_NS = "http://specs.openid.net/auth/2.0";
const IDENTIFIER_SELECT = `${OPENID_NS}/identifier_select`;
const STEAM_ID_PATTERN = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;

export class SteamOpenIdClient implements SteamAuthGateway {
  constructor(private readonly fetchFn: typeof fetch = fetch) {}

  createAuthenticationUrl(returnToUrl: string, realm: string): string {
    const params = new URLSearchParams({
      "openid.ns": OPENID_NS,
      "openid.mode": "checkid_setup",
      "openid.return_to": returnToUrl,
      "openid.realm": realm,
      "openid.identity": IDENTIFIER_SELECT,
      "openid.claimed_id": IDENTIFIER_SELECT
    });

    return `${STEAM_OPENID_URL}?${params.toString()}`;
  }

  async validateCallback(
    callback: SteamOpenIdCallback,
    expectedReturnToUrl: string
  ): Promise<string> {
    if (
      callback["openid.mode"] !== "id_res" ||
      callback["openid.op_endpoint"] !== STEAM_OPENID_URL ||
      callback["openid.return_to"] !== expectedReturnToUrl
    ) {
      throw new Error("Steam OpenID callback parameters are invalid.");
    }

    const claimedId = callback["openid.claimed_id"];
    const steamId = claimedId?.match(STEAM_ID_PATTERN)?.[1];
    if (!steamId || callback["openid.identity"] !== claimedId) {
      throw new Error("Steam OpenID identity is invalid.");
    }

    const verificationParams = new URLSearchParams();
    for (const [key, value] of Object.entries(callback)) {
      if (key.startsWith("openid.") && value !== undefined) {
        verificationParams.set(key, value);
      }
    }
    verificationParams.set("openid.mode", "check_authentication");

    const response = await this.fetchFn(STEAM_OPENID_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: verificationParams.toString()
    });

    if (!response.ok) {
      throw new Error(`Steam OpenID verification failed with status ${response.status}.`);
    }

    const verificationBody = await response.text();
    if (!verificationBody.split(/\r?\n/).includes("is_valid:true")) {
      throw new Error("Steam OpenID assertion could not be verified.");
    }

    return steamId;
  }
}
