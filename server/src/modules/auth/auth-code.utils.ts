import { createHash, randomBytes } from "node:crypto";

export const AUTH_CODE_TTL_MS = 60_000;

export function createAuthCode(): string {
  return randomBytes(32).toString("base64url");
}

export function hashAuthCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
