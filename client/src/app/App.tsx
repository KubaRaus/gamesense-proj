import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  authenticateWithSteam,
  getCompatibility,
  getUserProfile,
  searchGames
} from "../shared/api/gamesense-api";

function stringifyResult(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function App() {
  const [token, setToken] = useState("");
  const [openIdResponse, setOpenIdResponse] = useState("ok");
  const [gamesQuery, setGamesQuery] = useState("ha");
  const [profileUserId, setProfileUserId] = useState("usr_1");
  const [compatibilityA, setCompatibilityA] = useState("usr_1");
  const [compatibilityB, setCompatibilityB] = useState("usr_2");

  const authMutation = useMutation({
    mutationFn: authenticateWithSteam,
    onSuccess: (result) => setToken(result.accessToken)
  });

  const gamesMutation = useMutation({
    mutationFn: (query: string) => searchGames(query)
  });

  const profileMutation = useMutation({
    mutationFn: (userId: string) => getUserProfile(userId, token)
  });

  const compatibilityMutation = useMutation({
    mutationFn: ({ userA, userB }: { userA: string; userB: string }) =>
      getCompatibility(userA, userB, token)
  });

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>GameSense Prototype</h1>
        <p>Interactive API test panel for auth, search, profile, and compatibility.</p>
      </header>

      <section className="card">
        <h2>1) Steam Auth Callback</h2>
        <label>
          OpenID response
          <input value={openIdResponse} onChange={(event) => setOpenIdResponse(event.target.value)} />
        </label>
        <button onClick={() => authMutation.mutate(openIdResponse)} disabled={authMutation.isPending}>
          {authMutation.isPending ? "Authorizing..." : "Run Auth Callback"}
        </button>
        {authMutation.error && <pre>{String(authMutation.error.message)}</pre>}
        {authMutation.data && <pre>{stringifyResult(authMutation.data)}</pre>}
        <p className="token">Token: {token || "(missing - run auth first)"}</p>
      </section>

      <section className="card">
        <h2>2) Games Search</h2>
        <label>
          Query
          <input value={gamesQuery} onChange={(event) => setGamesQuery(event.target.value)} />
        </label>
        <button onClick={() => gamesMutation.mutate(gamesQuery)} disabled={gamesMutation.isPending}>
          {gamesMutation.isPending ? "Searching..." : "Search Games"}
        </button>
        {gamesMutation.error && <pre>{String(gamesMutation.error.message)}</pre>}
        {gamesMutation.data && <pre>{stringifyResult(gamesMutation.data)}</pre>}
      </section>

      <section className="card">
        <h2>3) User Profile (requires token)</h2>
        <label>
          User ID
          <input value={profileUserId} onChange={(event) => setProfileUserId(event.target.value)} />
        </label>
        <button
          onClick={() => profileMutation.mutate(profileUserId)}
          disabled={profileMutation.isPending || !token}
        >
          {profileMutation.isPending ? "Loading..." : "Fetch Profile"}
        </button>
        {profileMutation.error && <pre>{String(profileMutation.error.message)}</pre>}
        {profileMutation.data && <pre>{stringifyResult(profileMutation.data)}</pre>}
      </section>

      <section className="card">
        <h2>4) Taste Overlap (requires token)</h2>
        <label>
          User A
          <input value={compatibilityA} onChange={(event) => setCompatibilityA(event.target.value)} />
        </label>
        <label>
          User B
          <input value={compatibilityB} onChange={(event) => setCompatibilityB(event.target.value)} />
        </label>
        <button
          onClick={() => compatibilityMutation.mutate({ userA: compatibilityA, userB: compatibilityB })}
          disabled={compatibilityMutation.isPending || !token}
        >
          {compatibilityMutation.isPending ? "Calculating..." : "Run Compatibility"}
        </button>
        {compatibilityMutation.error && <pre>{String(compatibilityMutation.error.message)}</pre>}
        {compatibilityMutation.data && <pre>{stringifyResult(compatibilityMutation.data)}</pre>}
      </section>
    </main>
  );
}
