export interface AuthenticatedUser {
  id: string;
  steamId: string;
  username: string;
  avatarUrl: string | null;
}

export interface AuthCodeRepository {
  create(userId: string): Promise<string>;
  consume(code: string): Promise<AuthenticatedUser | null>;
}
