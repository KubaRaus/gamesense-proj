import jwt, { type JwtPayload } from "jsonwebtoken";

const DEFAULT_JWT_SECRET = "gamesense-dev-secret";
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 3600;

export interface AccessTokenClaims extends JwtPayload {
  sub: string;
  steamId: string;
  username: string;
}

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
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
