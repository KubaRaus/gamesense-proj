import type {
  AuthCodeRepository,
  AuthenticatedUser
} from "./auth-code.repository";
import {
  AUTH_CODE_TTL_MS,
  createAuthCode,
  hashAuthCode
} from "./auth-code.utils";
import type { UsersRepository } from "../users/users.repository";

interface StoredAuthCode {
  userId: string;
  expiresAt: number;
  consumed: boolean;
}

export class InMemoryAuthCodeRepository implements AuthCodeRepository {
  private readonly codes = new Map<string, StoredAuthCode>();

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userId: string): Promise<string> {
    const code = createAuthCode();
    this.codes.set(hashAuthCode(code), {
      userId,
      expiresAt: Date.now() + AUTH_CODE_TTL_MS,
      consumed: false
    });
    return code;
  }

  async consume(code: string): Promise<AuthenticatedUser | null> {
    const storedCode = this.codes.get(hashAuthCode(code));
    if (!storedCode || storedCode.consumed || storedCode.expiresAt <= Date.now()) {
      return null;
    }

    storedCode.consumed = true;
    const user = await this.usersRepository.findById(storedCode.userId);
    return user
      ? {
          id: user.id,
          steamId: user.steamId,
          username: user.username,
          avatarUrl: user.avatarUrl
        }
      : null;
  }
}
