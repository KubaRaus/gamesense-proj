import assert from "node:assert/strict";
import test from "node:test";
import { IgdbClient } from "../src/integrations/igdb/igdb.client";
import { IgdbTokenProvider } from "../src/integrations/igdb/igdb-token.provider";

const credentials = {
  clientId: "client-id",
  clientSecret: "client-secret"
};

test("IgdbTokenProvider caches a valid Twitch access token", async () => {
  let calls = 0;
  const fetchMock = (async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        access_token: "access-token",
        expires_in: 3600
      }),
      { status: 200 }
    );
  }) as typeof fetch;

  const provider = new IgdbTokenProvider(credentials, fetchMock);

  assert.equal(await provider.getAccessToken(), "access-token");
  assert.equal(await provider.getAccessToken(), "access-token");
  assert.equal(calls, 1);
});

test("IgdbClient maps IGDB search results to catalog games", async () => {
  let capturedRequest: { url: string; init?: RequestInit } | null = null;
  const fetchMock = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedRequest = { url: String(input), init };
    return new Response(
      JSON.stringify([
        {
          id: 7346,
          name: "Elden Ring",
          first_release_date: 1645660800,
          cover: { image_id: "co4jni" },
          genres: [{ name: "Role-playing (RPG)" }, { name: "Adventure" }]
        }
      ]),
      { status: 200 }
    );
  }) as typeof fetch;

  const client = new IgdbClient(
    credentials,
    { getAccessToken: async () => "access-token" },
    fetchMock
  );

  const games = await client.searchGames('Elden "Ring"', 10);

  assert.equal(capturedRequest?.url, "https://api.igdb.com/v4/games");
  assert.equal(capturedRequest?.init?.method, "POST");
  assert.match(String(capturedRequest?.init?.body), /search "Elden \\"Ring\\""/);
  assert.deepEqual(games, [
    {
      igdbId: 7346,
      name: "Elden Ring",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
      releaseYear: 2022,
      genres: ["Role-playing (RPG)", "Adventure"]
    }
  ]);
});

test("IgdbClient resolves Steam app IDs to IGDB metadata", async () => {
  let capturedRequest: { url: string; init?: RequestInit } | null = null;
  const fetchMock = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedRequest = { url: String(input), init };
    return new Response(
      JSON.stringify([
        {
          uid: "1245620",
          game: {
            id: 119133,
            name: "Elden Ring",
            first_release_date: 1645660800,
            cover: { image_id: "co4jni" },
            genres: [
              { id: 12, name: "Role-playing (RPG)" },
              { id: 31, name: "Adventure" }
            ]
          }
        }
      ]),
      { status: 200 }
    );
  }) as typeof fetch;
  const client = new IgdbClient(
    credentials,
    { getAccessToken: async () => "access-token" },
    fetchMock
  );

  const metadata = await client.getBySteamAppIds([1245620, 1245620]);

  assert.equal(capturedRequest?.url, "https://api.igdb.com/v4/external_games");
  assert.match(String(capturedRequest?.init?.body), /where category = 1/);
  assert.match(String(capturedRequest?.init?.body), /uid = \("1245620"\)/);
  assert.deepEqual(metadata, [
    {
      steamAppId: 1245620,
      igdbId: 119133,
      name: "Elden Ring",
      coverUrl:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
      releaseYear: 2022,
      genres: [
        { igdbGenreId: 12, name: "Role-playing (RPG)" },
        { igdbGenreId: 31, name: "Adventure" }
      ]
    }
  ]);
});
