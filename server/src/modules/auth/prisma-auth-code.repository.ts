import type { PrismaClient } from "@prisma/client";
import type {
  AuthCodeRepository,
  AuthenticatedUser
} from "./auth-code.repository";
import {
  AUTH_CODE_TTL_MS,
  createAuthCode,
  hashAuthCode
} from "./auth-code.utils";

export class PrismaAuthCodeRepository implements AuthCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string): Promise<string> {
    const code = createAuthCode();
    await this.prisma.authCode.create({
      data: {
        codeHash: hashAuthCode(code),
        userId,
        expiresAt: new Date(Date.now() + AUTH_CODE_TTL_MS)
      }
    });
    return code;
  }

  async consume(code: string): Promise<AuthenticatedUser | null> {
    const codeHash = hashAuthCode(code);

    return this.prisma.$transaction(async (tx) => {
      const authCode = await tx.authCode.findUnique({
        where: { codeHash },
        include: { user: true }
      });
      if (
        !authCode ||
        authCode.consumedAt ||
        authCode.expiresAt <= new Date()
      ) {
        return null;
      }

      const consumed = await tx.authCode.updateMany({
        where: {
          id: authCode.id,
          consumedAt: null,
          expiresAt: { gt: new Date() }
        },
        data: { consumedAt: new Date() }
      });
      if (consumed.count !== 1) {
        return null;
      }

      return {
        id: authCode.user.id,
        steamId: authCode.user.steamId,
        username: authCode.user.username,
        avatarUrl: authCode.user.avatarUrl
      };
    });
  }
}
