# GameSense Project Plan (Prototype v0.1)

## Scope

Prototype includes:
- Steam auth + library import
- Game catalog and search (IGDB proxy)
- Taste Overlap (Jaccard by genres)
- Basic UI only (no advanced design polish)

Out of scope for v0.1:
- Full Gaming Wrapped analytics experience

## Recommended Monorepo Structure

```text
gamesense-proj/
  client/
    src/
      app/
      features/
        auth/
        games/
        compatibility/
        wrapped/
      shared/
        api/
        components/
        hooks/
        utils/
  server/
    prisma/
      schema.prisma
    src/
      modules/
        auth/
        users/
        games/
        compatibility/
      integrations/
        steam/
        igdb/
      shared/
        auth/
        errors/
        middleware/
        utils/
  packages/
    types/
    config/
  docs/
    PROJECT_PLAN.md
    API_CONTRACT.md
```

## Sprint 1 - Foundation

### Goals
- Bootstrap monorepo (`client`, `server`, `packages`)
- Establish TypeScript base config and workspace scripts
- Create minimal client/server boot paths

### Deliverables
- Workspace `package.json` with scripts
- Vite React client scaffold with TanStack Query
- Express server scaffold with health endpoint

### Risks
- Toolchain drift between packages

### Acceptance Criteria
- `npm run dev` starts both apps
- `npm run typecheck` passes across workspaces

## Sprint 2 - Data Layer

### Goals
- Define relational Prisma schema
- Prepare DB env conventions and migration baseline

### Deliverables
- `server/prisma/schema.prisma`
- Basic DB config in `server/.env.example`

### Risks
- Wrong join design for future compatibility calculations

### Acceptance Criteria
- Prisma schema validates
- Relations support user library and game genres

## Sprint 3 - Integrations + Auth

### Goals
- Implement Steam login handshake and JWT issuing
- Add IGDB proxy client with basic cache

### Deliverables
- Auth module skeleton + callback flow
- IGDB integration adapter and typed responses

### Risks
- External API limits and inconsistent payloads

### Acceptance Criteria
- User can authenticate and receive JWT
- Search endpoint returns mapped game data

## Sprint 4 - Core MVP Features

### Goals
- Build player profile endpoint with imported library stats
- Implement compatibility endpoint (Jaccard index)

### Deliverables
- User profile DTO and endpoint
- Taste Overlap service with genre-based set operations

### Risks
- Sparse data for new users reduces overlap quality

### Acceptance Criteria
- Two valid users return deterministic overlap score
- Profile endpoint returns library aggregates

## Sprint 5 - Prototype Hardening

### Goals
- Polish core flows for demo readiness
- Add baseline tests and observability essentials

### Deliverables
- Integration tests for auth/profile/compatibility
- Structured request logging with request id
- Basic UI polish for prototype demo

### Risks
- Last-mile integration bugs close to demo

### Acceptance Criteria
- End-to-end demo flow works reliably
- Critical API routes have basic test coverage
