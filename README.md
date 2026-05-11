# GameSense

GameSense is a prototype of an analytical-social platform for gamers ("Letterboxd/Filmweb for video games").

This repository is a TypeScript monorepo with:
- `client` (React + Vite + Tailwind + TanStack Query)
- `server` (Node.js + Express + Prisma)
- `packages/types` (shared API types)

## Requirements

- Node.js `>=20`
- npm `>=10`
- (Optional for future DB work) PostgreSQL

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env files:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Start both apps:

```bash
npm run dev
```

4. Open:
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

- Steam auth callback prototype with signed JWT
- Protected profile endpoint (`Bearer` token required)
- Games search endpoint (IGDB integration scaffold with mock results)
- Taste Overlap endpoint (Jaccard index on prototype genre sets)
- Interactive frontend panel for manual API testing

## API (Prototype)

Base URL: `http://localhost:3000/api`

- `POST /auth/steam/callback`
  - Body: `{ "openIdResponse": "ok" }`
  - Returns access token + basic user payload

- `GET /games/search?q=ha`
  - Returns game list from prototype IGDB adapter

- `GET /users/:userId/profile`
  - Requires `Authorization: Bearer <token>`
  - Returns profile with aggregates (`gameCount`, `totalPlaytimeMinutes`, `topGenres`, `recentGames`)

- `GET /compatibility/:userA/:userB`
  - Requires `Authorization: Bearer <token>`
  - Returns compatibility score and Jaccard breakdown

## Testing

Automated tests:

```bash
npm run test
```

What is covered now:
- health endpoint
- auth callback
- query validation (`games/search`)
- protected routes auth behavior
- profile data flow + not-found case
- compatibility result + not-found case

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
- If API calls from frontend fail, confirm `client/.env` contains:
  - `VITE_API_URL="http://localhost:3000/api"`
- If protected endpoints return `401`, run auth callback first and use returned token.
