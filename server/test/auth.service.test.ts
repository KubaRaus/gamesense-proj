import assert from "node:assert/strict";
import test from "node:test";
import type {
  AuthCodeRepository,
  AuthenticatedUser
} from "../src/modules/auth/auth-code.repository";
import type { SteamAuthGateway } from "../src/modules/auth/steam-auth.gateway";
import type { LibrarySyncRepository } from "../src/modules/users/library-sync.repository";
import type { SteamGameMetadataGateway } from "../src/modules/users/steam-game-metadata.gateway";
import type { SteamLibraryGateway } from "../src/modules/users/steam-library.gateway";

process.env.JWT_SECRET = "test-jwt-secret";

const [{ AuthService }, { LibrarySyncService }, { verifyAccessToken }] =
  await Promise.all([
    import("../src/modules/auth/auth.service"),
    import("../src/modules/users/library-sync.service"),
    import("../src/shared/auth/jwt")
  ]);

const steamId = "76561198000000001";
const user: AuthenticatedUser = {
  id: "usr_test",
  steamId,
  username: "TestPlayer",
  avatarUrl: "https://example.com/avatar.jpg"
};

test("AuthService validates Steam, synchronizes the library, and exchanges a one-time code", async () => {
  const state = "state-value";
  const expectedReturnTo =
    `http://localhost:3000/api/auth/steam/callback?state=${state}`;
  let synchronizedSteamId: string | null = null;

  const steamAuthGateway: SteamAuthGateway = {
    createAuthenticationUrl: (returnToUrl, realm) => {
      assert.equal(returnToUrl, expectedReturnTo);
      assert.equal(realm, "http://localhost:3000");
      return "https://steamcommunity.com/openid/login";
    },
    validateCallback: async (callback, returnToUrl) => {
      assert.deepEqual(callback, { "openid.mode": "id_res" });
      assert.equal(returnToUrl, expectedReturnTo);
      return steamId;
    }
  };
  const steamLibraryGateway: SteamLibraryGateway = {
    getPlayerProfile: async (requestedSteamId) => {
      synchronizedSteamId = requestedSteamId;
      return {
        steamId,
        username: user.username,
        avatarUrl: user.avatarUrl
      };
    },
    getOwnedGames: async () => []
  };
  const metadataGateway: SteamGameMetadataGateway = {
    getBySteamAppIds: async () => []
  };
  const syncRepository: LibrarySyncRepository = {
    synchronize: async (profile) => ({
      ...user,
      username: profile.username,
      games: []
    })
  };
  const librarySyncService = new LibrarySyncService(
    steamLibraryGateway,
    metadataGateway,
    syncRepository
  );

  let codeAvailable = false;
  const authCodeRepository: AuthCodeRepository = {
    create: async (userId) => {
      assert.equal(userId, user.id);
      codeAvailable = true;
      return "one-time-code";
    },
    consume: async (code) => {
      if (code !== "one-time-code" || !codeAvailable) {
        return null;
      }

      codeAvailable = false;
      return user;
    }
  };
  const service = new AuthService(
    steamAuthGateway,
    librarySyncService,
    authCodeRepository,
    { serverPublicUrl: "http://localhost:3000" }
  );

  assert.equal(
    service.createSteamAuthenticationUrl(state),
    "https://steamcommunity.com/openid/login"
  );

  const code = await service.completeSteamLogin({
    state,
    callback: { "openid.mode": "id_res" }
  });
  assert.equal(code, "one-time-code");
  assert.equal(synchronizedSteamId, steamId);

  const response = await service.exchangeSteamAuthCode({ code });
  assert.ok(response);
  assert.deepEqual(response.user, user);
  assert.equal(response.expiresIn, 3600);

  const claims = verifyAccessToken(response.accessToken);
  assert.equal(claims.sub, user.id);
  assert.equal(claims.steamId, user.steamId);
  assert.equal(claims.username, user.username);

  assert.equal(await service.exchangeSteamAuthCode({ code }), null);
});
