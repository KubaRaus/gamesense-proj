import jwt, { type JwtPayload } from "jsonwebtoken";
import { getJwtSecret } from "../config/runtime-env";

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 3600;

export interface AccessTokenClaims extends JwtPayload {
  sub: string;
  steamId: string;
  username: string;
}

export function signAccessToken(claims: Omit<AccessTokenClaims, keyof JwtPayload>): string {
  return jwt.sign(claims, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS
  });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  return jwt.verify(token, getJwtSecret()) as AccessTokenClaims;
}

export { ACCESS_TOKEN_EXPIRES_IN_SECONDS };
