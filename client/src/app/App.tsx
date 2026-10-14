import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  API_BASE_URL,
  authenticateWithSteam,
  getCompatibility,
  getUserProfile,
  searchGames
} from "../shared/api/gamesense-api";
import { Login } from "../pages/Login";
import { Search } from "../pages/Search";
import { Overlap } from "../pages/Overlap";

// Tymczasowe puste komponenty dla głównych widoków
// (Później przeniesiesz je do dedykowanych plików w src/pages/)
// const Login = () => <div className="p-8"><h1 className="text-2xl">Zaloguj się przez Steam</h1></div>;
// const Search = () => <div className="p-8"><h1 className="text-2xl">Wyszukiwarka Gier</h1></div>;
// const Overlap = () => <div className="p-8"><h1 className="text-2xl">Taste Overlap</h1></div>;

const TOKEN_STORAGE_KEY = "gamesense.prototype.token";

function stringifyResult(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function maskToken(token: string) {
  if (token.length <= 16) {
    return token;
  }
  return `${token.slice(0, 8)}...${token.slice(-6)}`;
}

// 1. Zmieniliśmy nazwę funkcji z App na ApiTestPanel
export function ApiTestPanel() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? "");
  const [openIdResponse, setOpenIdResponse] = useState("ok");
  const [gamesQuery, setGamesQuery] = useState("ha");
  const [profileUserId, setProfileUserId] = useState("usr_1");
  const [compatibilityA, setCompatibilityA] = useState("usr_1");
  const [compatibilityB, setCompatibilityB] = useState("usr_2");
  const hasToken = useMemo(() => token.trim().length > 0, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return;
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, [token]);

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

  // Dodatkowa klasa ułatwiająca stylowanie pól input
  const inputClass = "bg-slate-900 border border-slate-700 text-white rounded px-3 py-1 ml-2 focus:outline-none focus:border-yellow-500 w-48";
  // Klasa dla przycisków
  const btnClass = "bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold py-1 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      <header className="bg-slate-800/80 border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-lg">
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">GameSense API Prototype Panel</h1>
        <p className="text-slate-400 text-sm">Interactive test panel for auth, search, profile, and compatibility.</p>
        <p className="text-slate-500 text-xs mt-1 font-mono">API URL: {API_BASE_URL}</p>
      </header>

      {/* 1) Auth */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">1) Steam Auth Callback</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-slate-300">
            OpenID response:
            <input className={inputClass} value={openIdResponse} onChange={(e) => setOpenIdResponse(e.target.value)} />
          </label>
          <button className={btnClass} onClick={() => authMutation.mutate(openIdResponse)} disabled={authMutation.isPending}>
            {authMutation.isPending ? "Authorizing..." : "Run Auth Callback"}
          </button>
        </div>
        
        {authMutation.error && <pre className="text-red-400 bg-red-900/20 p-2 rounded text-xs">{String(authMutation.error.message)}</pre>}
        {authMutation.data && <pre className="text-green-400 bg-slate-900 p-2 rounded text-xs overflow-auto">{stringifyResult(authMutation.data)}</pre>}
        
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <p className="font-mono text-sm text-yellow-300">
            Token: <span className="text-slate-400">{token ? maskToken(token) : "(missing - run auth first)"}</span>
          </p>
          <button 
            className="text-xs bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-3 rounded transition-colors disabled:opacity-50"
            onClick={() => setToken("")} disabled={!hasToken}
          >
            Clear Token
          </button>
        </div>
      </section>

      {/* 2) Search */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">2) Games Search</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-slate-300">
            Query:
            <input className={inputClass} value={gamesQuery} onChange={(e) => setGamesQuery(e.target.value)} />
          </label>
          <button className={btnClass} onClick={() => gamesMutation.mutate(gamesQuery)} disabled={gamesMutation.isPending}>
            {gamesMutation.isPending ? "Searching..." : "Search Games"}
          </button>
        </div>
        {gamesMutation.error && <pre className="text-red-400 bg-red-900/20 p-2 rounded text-xs">{String(gamesMutation.error.message)}</pre>}
        {gamesMutation.data && <pre className="text-green-400 bg-slate-900 p-2 rounded text-xs overflow-auto max-h-48">{stringifyResult(gamesMutation.data)}</pre>}
      </section>

      {/* 3) Profile */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">3) User Profile (requires token)</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-slate-300">
            User ID:
            <input className={inputClass} value={profileUserId} onChange={(e) => setProfileUserId(e.target.value)} />
          </label>
          <button className={btnClass} onClick={() => profileMutation.mutate(profileUserId)} disabled={profileMutation.isPending || !hasToken}>
            {profileMutation.isPending ? "Loading..." : "Fetch Profile"}
          </button>
        </div>
        {profileMutation.error && <pre className="text-red-400 bg-red-900/20 p-2 rounded text-xs">{String(profileMutation.error.message)}</pre>}
        {profileMutation.data && <pre className="text-green-400 bg-slate-900 p-2 rounded text-xs overflow-auto max-h-48">{stringifyResult(profileMutation.data)}</pre>}
      </section>

      {/* 4) Taste Overlap */}
      <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">4) Taste Overlap (requires token)</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-slate-300">
            User A:
            <input className={`${inputClass} w-24`} value={compatibilityA} onChange={(e) => setCompatibilityA(e.target.value)} />
          </label>
          <label className="text-slate-300">
            User B:
            <input className={`${inputClass} w-24`} value={compatibilityB} onChange={(e) => setCompatibilityB(e.target.value)} />
          </label>
          <button className={btnClass} onClick={() => compatibilityMutation.mutate({ userA: compatibilityA, userB: compatibilityB })} disabled={compatibilityMutation.isPending || !hasToken}>
            {compatibilityMutation.isPending ? "Calculating..." : "Run Compatibility"}
          </button>
        </div>
        {compatibilityMutation.error && <pre className="text-red-400 bg-red-900/20 p-2 rounded text-xs">{String(compatibilityMutation.error.message)}</pre>}
        {compatibilityMutation.data && <pre className="text-green-400 bg-slate-900 p-2 rounded text-xs overflow-auto max-h-48">{stringifyResult(compatibilityMutation.data)}</pre>}
      </section>
    </main>
  );
}

// 2. Dodajemy nową funkcję główną App z React Routerem
export function App() {
  return (
    <BrowserRouter>
      {/* Pasek nawigacyjny do przemieszczania się podczas tworzenia */}
      <nav className="bg-slate-800 p-4 border-b border-slate-700 flex gap-4 text-green-400">
        <Link to="/" className="hover:text-green-300 transition-colors">Logowanie</Link>
        <Link to="/search" className="hover:text-green-300 transition-colors">Wyszukiwarka</Link>
        <Link to="/overlap" className="hover:text-green-300 transition-colors">Taste Overlap</Link>
        <Link to="/api-test" className="text-yellow-400 hover:text-yellow-300 font-semibold ml-auto transition-colors">
          Panel Testowy API
        </Link>
      </nav>

      {/* Kontener dla widoków z ciemnym tłem pasującym do stylistyki */}
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/overlap" element={<Overlap />} />
          <Route path="/api-test" element={<ApiTestPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}