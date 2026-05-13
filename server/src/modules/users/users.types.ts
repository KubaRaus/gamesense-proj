export interface UserLibraryGame {
  gameId: string;
  name: string;
  genres: string[];
  playtimeMinutes: number;
  lastPlayedAt: string | null;
}

export interface UserRecord {
  id: string;
  steamId: string;
  username: string;
  avatarUrl: string | null;
  games: UserLibraryGame[];
}
