function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requireUrl(name: string): string {
  const value = requireEnv(name);
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
}

export type GamesCatalogProvider = "mock" | "igdb";

export function getGamesCatalogProvider(): GamesCatalogProvider {
  const provider = process.env.GAMES_CATALOG_PROVIDER ?? "mock";
  if (provider !== "mock" && provider !== "igdb") {
    throw new Error("GAMES_CATALOG_PROVIDER must be either 'mock' or 'igdb'.");
  }

  return provider;
}

export function assertRuntimeEnv() {
  requireEnv("JWT_SECRET");
  requireEnv("DATABASE_URL");
  requireEnv("STEAM_API_KEY");
  requireUrl("SERVER_PUBLIC_URL");
  requireUrl("CLIENT_URL");

  if (getGamesCatalogProvider() === "igdb") {
    requireEnv("IGDB_CLIENT_ID");
    requireEnv("IGDB_CLIENT_SECRET");
  }
}

export function getServerPort(): number {
  return Number(process.env.PORT ?? 3000);
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}

export function getIgdbCredentials() {
  return {
    clientId: requireEnv("IGDB_CLIENT_ID"),
    clientSecret: requireEnv("IGDB_CLIENT_SECRET")
  };
}

export function getSteamConfig() {
  return {
    apiKey: requireEnv("STEAM_API_KEY"),
    serverPublicUrl: requireUrl("SERVER_PUBLIC_URL"),
    clientUrl: requireUrl("CLIENT_URL")
  };
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}
