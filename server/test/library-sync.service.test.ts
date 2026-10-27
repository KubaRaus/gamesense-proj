import assert from "node:assert/strict";
import test from "node:test";
import type { LibrarySyncRepository } from "../src/modules/users/library-sync.repository";
import { LibrarySyncService } from "../src/modules/users/library-sync.service";
import type {
  SteamGameMetadata,
  SteamGameMetadataGateway
} from "../src/modules/users/steam-game-metadata.gateway";
import type { SteamLibraryGateway } from "../src/modules/users/steam-library.gateway";

const profile = {
  steamId: "76561198000000001",
  username: "TestPlayer",
  avatarUrl: null
};
const games = [
  {
    steamAppId: 1245620,
    name: "Elden Ring",
    playtimeMinutes: 4200,
    lastPlayedAt: null
  }
];
const metadata = [
  {
    steamAppId: 1245620,
    igdbId: 119133,
    name: "Elden Ring",
    coverUrl: null,
    releaseYear: 2022,
    genres: [{ igdbGenreId: 12, name: "Role-playing (RPG)" }]
  }
];

test("LibrarySyncService fetches, enriches, and persists a Steam library", async () => {
  let synchronizedMetadata: SteamGameMetadata[] = [];
  const steamGateway: SteamLibraryGateway = {
    getPlayerProfile: async () => profile,
    getOwnedGames: async () => games
  };
  const metadataGateway: SteamGameMetadataGateway = {
    getBySteamAppIds: async () => metadata
  };
  const repository: LibrarySyncRepository = {
    synchronize: async (receivedProfile, receivedGames, receivedMetadata) => {
      assert.deepEqual(receivedProfile, profile);
      assert.deepEqual(receivedGames, games);
      synchronizedMetadata = receivedMetadata;
      return {
        id: "usr_test",
        ...profile,
        games: []
      };
    }
  };

  const service = new LibrarySyncService(
    steamGateway,
    metadataGateway,
    repository
  );
  const user = await service.synchronize(profile.steamId);

  assert.equal(user.id, "usr_test");
  assert.deepEqual(synchronizedMetadata, metadata);
});

test("LibrarySyncService persists Steam data when IGDB enrichment fails", async () => {
  let metadataCount = -1;
  const service = new LibrarySyncService(
    {
      getPlayerProfile: async () => profile,
      getOwnedGames: async () => games
    },
    {
      getBySteamAppIds: async () => {
        throw new Error("IGDB unavailable");
      }
    },
    {
      synchronize: async (_profile, _games, receivedMetadata) => {
        metadataCount = receivedMetadata.length;
        return {
          id: "usr_test",
          ...profile,
          games: []
        };
      }
    }
  );

  await service.synchronize(profile.steamId);
  assert.equal(metadataCount, 0);
});
