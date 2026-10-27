import assert from "node:assert/strict";
import test from "node:test";
import { SteamWebApiClient } from "../src/integrations/steam/steam-web-api.client";

test("SteamWebApiClient maps player profile and owned games", async () => {
  const fetchMock = (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("GetPlayerSummaries")) {
      return new Response(
        JSON.stringify({
          response: {
            players: [
              {
                steamid: "76561198000000001",
                personaname: "TestPlayer",
                avatarfull: "https://avatars.steamstatic.com/avatar.jpg"
              }
            ]
          }
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        response: {
          game_count: 1,
          games: [
            {
              appid: 1245620,
              name: "Elden Ring",
              playtime_forever: 4200,
              rtime_last_played: 1_700_000_000
            }
          ]
        }
      }),
      { status: 200 }
    );
  }) as typeof fetch;
  const client = new SteamWebApiClient("api-key", fetchMock);

  assert.deepEqual(await client.getPlayerProfile("76561198000000001"), {
    steamId: "76561198000000001",
    username: "TestPlayer",
    avatarUrl: "https://avatars.steamstatic.com/avatar.jpg"
  });
  assert.deepEqual(await client.getOwnedGames("76561198000000001"), [
    {
      steamAppId: 1245620,
      name: "Elden Ring",
      playtimeMinutes: 4200,
      lastPlayedAt: new Date(1_700_000_000 * 1000)
    }
  ]);
});

test("SteamWebApiClient rejects a private Steam library", async () => {
  const fetchMock = (async () =>
    new Response(JSON.stringify({ response: {} }), { status: 200 })) as typeof fetch;
  const client = new SteamWebApiClient("api-key", fetchMock);

  await assert.rejects(
    client.getOwnedGames("76561198000000001"),
    /private or unavailable/
  );
});
