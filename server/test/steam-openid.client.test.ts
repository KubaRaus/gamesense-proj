import assert from "node:assert/strict";
import test from "node:test";
import { SteamOpenIdClient } from "../src/integrations/steam/steam-openid.client";

test("SteamOpenIdClient creates a Steam OpenID authentication URL", () => {
  const client = new SteamOpenIdClient();
  const returnTo = "http://localhost:3000/api/auth/steam/callback?state=state-token";
  const url = new URL(
    client.createAuthenticationUrl(returnTo, "http://localhost:3000")
  );

  assert.equal(url.origin + url.pathname, "https://steamcommunity.com/openid/login");
  assert.equal(url.searchParams.get("openid.mode"), "checkid_setup");
  assert.equal(url.searchParams.get("openid.return_to"), returnTo);
  assert.equal(url.searchParams.get("openid.realm"), "http://localhost:3000");
});

test("SteamOpenIdClient verifies a valid callback and returns SteamID", async () => {
  let verificationBody = "";
  const fetchMock = (async (_input: string | URL | Request, init?: RequestInit) => {
    verificationBody = String(init?.body);
    return new Response("ns:http://specs.openid.net/auth/2.0\nis_valid:true\n", {
      status: 200
    });
  }) as typeof fetch;
  const client = new SteamOpenIdClient(fetchMock);
  const returnTo = "http://localhost:3000/api/auth/steam/callback?state=state-token";
  const claimedId = "https://steamcommunity.com/openid/id/76561198000000001";

  const steamId = await client.validateCallback(
    {
      "openid.mode": "id_res",
      "openid.op_endpoint": "https://steamcommunity.com/openid/login",
      "openid.return_to": returnTo,
      "openid.claimed_id": claimedId,
      "openid.identity": claimedId,
      "openid.response_nonce": "nonce",
      "openid.assoc_handle": "handle",
      "openid.signed": "signed-fields",
      "openid.sig": "signature"
    },
    returnTo
  );

  assert.equal(steamId, "76561198000000001");
  assert.match(verificationBody, /openid\.mode=check_authentication/);
});

test("SteamOpenIdClient rejects an unverified callback", async () => {
  const fetchMock = (async () =>
    new Response("is_valid:false\n", { status: 200 })) as typeof fetch;
  const client = new SteamOpenIdClient(fetchMock);
  const returnTo = "http://localhost:3000/api/auth/steam/callback";
  const claimedId = "https://steamcommunity.com/openid/id/76561198000000001";

  await assert.rejects(
    client.validateCallback(
      {
        "openid.mode": "id_res",
        "openid.op_endpoint": "https://steamcommunity.com/openid/login",
        "openid.return_to": returnTo,
        "openid.claimed_id": claimedId,
        "openid.identity": claimedId
      },
      returnTo
    ),
    /could not be verified/
  );
});
