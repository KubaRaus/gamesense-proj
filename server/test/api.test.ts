import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

test("GET /health returns service status", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("POST /api/auth/steam/callback returns prototype token", async () => {
  const response = await request(app).post("/api/auth/steam/callback").send({ openIdResponse: "ok" });
  assert.equal(response.status, 200);
  assert.equal(typeof response.body.accessToken, "string");
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

test("GET /api/compatibility/:userA/:userB returns overlap payload", async () => {
  const authResponse = await request(app)
    .post("/api/auth/steam/callback")
    .send({ openIdResponse: "ok" });

  const accessToken = authResponse.body.accessToken as string;

  const response = await request(app)
    .get("/api/compatibility/usr_1/usr_2")
    .set("Authorization", `Bearer ${accessToken}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.userA, "usr_1");
  assert.equal(response.body.userB, "usr_2");
});
