import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";

process.env.JWT_SECRET = "test-jwt-secret";
process.env.STEAM_API_KEY = "test-steam-api-key";
process.env.SERVER_PUBLIC_URL = "http://localhost:3000";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.DATA_PROVIDER = "memory";
process.env.GAMES_CATALOG_PROVIDER = "mock";

const [{ createApp }, { signAccessToken }] = await Promise.all([
  import("../src/app"),
  import("../src/shared/auth/jwt")
]);

const app = createApp();

function createAccessToken() {
  return signAccessToken({
    sub: "usr_1",
    steamId: "76561190000000001",
    username: "Jakub"
  });
}

test("GET /health returns service status", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /api/auth/steam redirects to Steam OpenID and sets state cookie", async () => {
  const response = await request(app).get("/api/auth/steam");

  assert.equal(response.status, 302);
  const location = new URL(response.headers.location);
  assert.equal(location.origin, "https://steamcommunity.com");
  assert.equal(location.pathname, "/openid/login");
  assert.equal(location.searchParams.get("openid.mode"), "checkid_setup");

  const returnTo = new URL(location.searchParams.get("openid.return_to") ?? "");
  assert.equal(returnTo.origin, "http://localhost:3000");
  assert.equal(returnTo.pathname, "/api/auth/steam/callback");
  assert.ok(returnTo.searchParams.get("state"));

  const cookies = response.headers["set-cookie"] as unknown as string[];
  assert.ok(cookies.some((cookie) => cookie.includes("gamesense_steam_state=")));
  assert.ok(cookies.some((cookie) => cookie.includes("HttpOnly")));
  assert.ok(cookies.some((cookie) => cookie.includes("SameSite=Lax")));
});

test("GET /api/auth/steam/callback rejects a missing state cookie", async () => {
  const response = await request(app)
    .get("/api/auth/steam/callback")
    .query({ state: "a".repeat(32) });

  assert.equal(response.status, 302);
  assert.equal(
    response.headers.location,
    "http://localhost:5173/auth/callback?error=invalid_state"
  );
});

test("POST /api/auth/steam/exchange validates and rejects unknown codes", async () => {
  const invalidBodyResponse = await request(app)
    .post("/api/auth/steam/exchange")
    .send({});
  assert.equal(invalidBodyResponse.status, 400);
  assert.equal(invalidBodyResponse.body.error.code, "INVALID_BODY");

  const unknownCodeResponse = await request(app)
    .post("/api/auth/steam/exchange")
    .send({ code: "a".repeat(43) });
  assert.equal(unknownCodeResponse.status, 401);
  assert.equal(unknownCodeResponse.body.error.code, "INVALID_AUTH_CODE");
});

test("GET /api/games/search requires a query", async () => {
  const response = await request(app).get("/api/games/search");
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "INVALID_QUERY");
});

test("GET /api/users/:userId/profile requires authorization", async () => {
  const response = await request(app).get("/api/users/usr_1/profile");
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "UNAUTHORIZED");
  assert.equal(typeof response.body.error.requestId, "string");
});

test("GET /api/users/:userId/profile rejects invalid token", async () => {
  const response = await request(app)
    .get("/api/users/usr_1/profile")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "UNAUTHORIZED");
});

test("GET /api/users/:userId/profile returns aggregate profile", async () => {
  const accessToken = createAccessToken();
  const response = await request(app)
    .get("/api/users/usr_1/profile")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.username, "Jakub");
  assert.equal(response.body.gameCount, 2);
  assert.equal(response.body.totalPlaytimeMinutes, 6100);
});

test("GET /api/users/:userId/profile returns 404 for unknown user", async () => {
  const accessToken = createAccessToken();
  const response = await request(app)
    .get("/api/users/usr_404/profile")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, "USER_NOT_FOUND");
});

test("GET /api/compatibility/:userA/:userB returns overlap payload", async () => {
  const accessToken = createAccessToken();

  const response = await request(app)
    .get("/api/compatibility/usr_1/usr_2")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.userA, "usr_1");
  assert.equal(response.body.userB, "usr_2");
  assert.equal(response.body.overlapIndex, 0.5688);
  assert.equal(response.body.overlapPercentage, 57);
  assert.equal(response.body.presenceOverlapIndex, 0.4);
  assert.equal(response.body.method, "weighted-jaccard-playtime");
  assert.deepEqual(response.body.sharedGenres, ["Action", "RPG"]);
  assert.deepEqual(response.body.commonGames, [
    {
      gameId: "game_7346",
      name: "Elden Ring",
      userAPlaytimeMinutes: 4200,
      userBPlaytimeMinutes: 2750
    }
  ]);
});

test("GET /api/compatibility/:userA/:userB returns 404 for unknown user", async () => {
  const accessToken = createAccessToken();

  const response = await request(app)
    .get("/api/compatibility/usr_1/usr_404")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, "USER_NOT_FOUND");
});
