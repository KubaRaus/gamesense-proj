import type { Request, Response } from "express";
import { sendApiError } from "../../shared/http/errors";
import {
  steamCallbackQuerySchema,
  steamExchangeBodySchema
} from "./auth.schemas";
import { authHttpConfig, authService } from "./auth.dependencies";
import {
  authStatesMatch,
  createAuthState,
  readCookie,
  STEAM_STATE_COOKIE,
  STEAM_STATE_TTL_SECONDS
} from "./auth-state";
import type { SteamOpenIdCallback } from "./steam-auth.gateway";

const stateCookieBaseOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: authHttpConfig.secureCookies,
  path: "/api/auth/steam"
};
const stateCookieOptions = {
  ...stateCookieBaseOptions,
  maxAge: STEAM_STATE_TTL_SECONDS * 1000
};

export function steamLoginController(_req: Request, res: Response) {
  const state = createAuthState();
  res.cookie(STEAM_STATE_COOKIE, state, stateCookieOptions);
  return res.redirect(authService.createSteamAuthenticationUrl(state));
}

export async function steamCallbackController(req: Request, res: Response) {
  const parsed = steamCallbackQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return redirectWithError(res, "invalid_callback");
  }

  const cookieState = readCookie(req.headers.cookie, STEAM_STATE_COOKIE);
  if (!cookieState || !authStatesMatch(cookieState, parsed.data.state)) {
    return redirectWithError(res, "invalid_state");
  }

  const callback: SteamOpenIdCallback = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (key.startsWith("openid.") && typeof value === "string") {
      callback[key] = value;
    }
  }

  try {
    const code = await authService.completeSteamLogin({
      state: parsed.data.state,
      callback
    });
    res.clearCookie(STEAM_STATE_COOKIE, stateCookieBaseOptions);
    const callbackUrl = new URL("/auth/callback", authHttpConfig.clientUrl);
    callbackUrl.searchParams.set("code", code);
    return res.redirect(callbackUrl.toString());
  } catch {
    return redirectWithError(res, "steam_auth_failed");
  }
}

export async function steamExchangeController(req: Request, res: Response) {
  const parsed = steamExchangeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendApiError(res, 400, "INVALID_BODY", "Invalid auth code payload.");
  }

  const response = await authService.exchangeSteamAuthCode(parsed.data);
  if (!response) {
    return sendApiError(
      res,
      401,
      "INVALID_AUTH_CODE",
      "The auth code is invalid, expired, or already used."
    );
  }

  return res.status(200).json(response);
}

function redirectWithError(res: Response, error: string) {
  res.clearCookie(STEAM_STATE_COOKIE, stateCookieBaseOptions);
  const callbackUrl = new URL("/auth/callback", authHttpConfig.clientUrl);
  callbackUrl.searchParams.set("error", error);
  return res.redirect(callbackUrl.toString());
}
