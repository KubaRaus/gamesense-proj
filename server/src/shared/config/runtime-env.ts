function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function assertRuntimeEnv() {
  requireEnv("JWT_SECRET");
}

export function getServerPort(): number {
  return Number(process.env.PORT ?? 3000);
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}
