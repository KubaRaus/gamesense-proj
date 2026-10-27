import { randomBytes, timingSafeEqual } from "node:crypto";

export const STEAM_STATE_COOKIE = "gamesense_steam_state";
export const STEAM_STATE_TTL_SECONDS = 300;

export function createAuthState(): string {
  return randomBytes(32).toString("base64url");
}

export function authStatesMatch(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

export function readCookie(
  cookieHeader: string | undefined,
  name: string
): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}
