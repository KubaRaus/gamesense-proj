import { SteamOpenIdClient } from "../../integrations/steam/steam-openid.client";
import {
  getDataProvider,
  getSteamConfig
} from "../../shared/config/runtime-env";
import { prisma } from "../../shared/db/prisma-client";
import { librarySyncService } from "../users/library-sync.dependencies";
import { usersRepository } from "../users/users.dependencies";
import { InMemoryAuthCodeRepository } from "./in-memory-auth-code.repository";
import { PrismaAuthCodeRepository } from "./prisma-auth-code.repository";
import { AuthService } from "./auth.service";

const steamConfig = getSteamConfig();
const steamAuthGateway = new SteamOpenIdClient();
const authCodeRepository =
  getDataProvider() === "prisma"
    ? new PrismaAuthCodeRepository(prisma)
    : new InMemoryAuthCodeRepository(usersRepository);
const authService = new AuthService(
  steamAuthGateway,
  librarySyncService,
  authCodeRepository,
  { serverPublicUrl: steamConfig.serverPublicUrl }
);
const authHttpConfig = {
  clientUrl: steamConfig.clientUrl,
  secureCookies: steamConfig.serverPublicUrl.startsWith("https://")
};

export { authHttpConfig, authService };
