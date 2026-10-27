# GameSense

GameSense is a prototype of an analytical-social platform for gamers ("Letterboxd/Filmweb for video games").

This repository is a TypeScript monorepo with:
- `client` (React + Vite + Tailwind + TanStack Query)
- `server` (Node.js + Express + Prisma)
- `packages/types` (shared API types)

## Requirements

- Node.js `>=20`
- npm `>=10`
- Docker Desktop (recommended) or PostgreSQL 16
- Steam Web API key from `https://steamcommunity.com/dev/apikey`

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env files:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`
- Set a long random `JWT_SECRET`
- Set `STEAM_API_KEY`, `SERVER_PUBLIC_URL`, and `CLIENT_URL`
- Keep `GAMES_CATALOG_PROVIDER="mock"` for local demo data, or set it to `"igdb"` and provide credentials from the Twitch Developer Console:
  - `IGDB_CLIENT_ID`
  - `IGDB_CLIENT_SECRET`

3. Start PostgreSQL and apply the Prisma migration:

```bash
npm run db:up
npm run db:migrate
```

4. Start both apps:

```bash
npm run dev
```

5. Open:
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3000/health`

## Useful Scripts

From repository root:

- `npm run dev` - run backend and frontend together
- `npm run dev:server` - run only backend
- `npm run dev:client` - run only frontend
- `npm run test` - run backend smoke/integration tests
- `npm run typecheck` - run TS checks across workspaces
- `npm run build` - build all packages

## Current Prototype Features

- Steam OpenID 2.0 authentication with CSRF state validation
- Steam profile and owned-library synchronization into PostgreSQL
- One-time authorization-code exchange for a signed JWT
- Optional Steam-to-IGDB metadata and genre enrichment
- Protected profile endpoint (`Bearer` token required)
- Games search endpoint with selectable mock or live IGDB provider
- Taste Overlap endpoint using weighted Jaccard over playtime-normalized genre preferences
- Interactive frontend panel for manual API testing

## API (Prototype)

Base URL: `http://localhost:3000/api`

- `GET /auth/steam`
  - Starts Steam OpenID authentication and redirects to Steam

- `GET /auth/steam/callback`
  - Validates Steam's assertion, synchronizes the library, and redirects to `CLIENT_URL/auth/callback?code=...`

- `POST /auth/steam/exchange`
  - Body: `{ "code": "<one-time-code>" }`
  - Returns a one-hour access token and basic user payload

- `GET /games/search?q=ha`
  - Returns mapped games from the configured catalog provider

- `GET /users/:userId/profile`
  - Requires `Authorization: Bearer <token>`
  - Returns profile with aggregates (`gameCount`, `totalPlaytimeMinutes`, `topGenres`, `recentGames`)

- `GET /compatibility/:userA/:userB`
  - Requires `Authorization: Bearer <token>`
  - Returns weighted compatibility score, shared genres, common games and a genre-weight breakdown

## Testing

Automated tests:

```bash
npm run test
```

What is covered now:
- health endpoint
- Steam OpenID request and callback verification
- Steam Web API mapping and private-library handling
- auth start, state validation, one-time code exchange, and JWT claims
- library synchronization with optional IGDB enrichment
- query validation (`games/search`)
- protected routes auth behavior
- profile data flow + not-found case
- compatibility result + not-found case
- weighted Jaccard edge cases
- IGDB token caching, search mapping, and Steam App ID mapping

## Project Structure

```text
gamesense-proj/
  client/
  server/
  packages/
    config/
    types/
  docs/
```

## Documentation

- Architecture and planning: `docs/PROJECT_PLAN.md`
- API contract: `docs/API_CONTRACT.md`
- Full project specification: `docs/SPECYFIKACJA_PROJEKTU_GAMESENSE.md`

## Troubleshooting

- If `5173` is already in use, Vite can switch to another port (e.g. `5174`).
- If the server fails during startup, verify every required value in `server/.env`. With `DATA_PROVIDER="prisma"`, `DATABASE_URL` is also required.
- `SERVER_PUBLIC_URL` must be the externally reachable backend origin used by Steam OpenID. `CLIENT_URL` controls CORS and the post-login redirect.
- Steam library import requires the user's game details to be public.
- If API calls from frontend fail, confirm `client/.env` contains:
  - `VITE_API_URL="http://localhost:3000/api"`
- If protected endpoints return `401`, complete the Steam login and exchange the returned one-time code.
