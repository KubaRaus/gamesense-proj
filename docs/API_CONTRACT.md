# GameSense API Contract (Prototype v0.1)

Base URL: `/api`
Auth: `Authorization: Bearer <accessToken>`
Content-Type: `application/json`

## 1) Start Steam Authentication

`GET /api/auth/steam`

### Purpose
Create a short-lived CSRF state, store it in an `HttpOnly` cookie, and redirect
the browser to Steam OpenID 2.0.

### Auth Requirement
No prior JWT required.

### Success Response
`302 Found` with:
- `Location: https://steamcommunity.com/openid/login?...`
- `Set-Cookie: gamesense_steam_state=...; HttpOnly; SameSite=Lax`

## 2) Steam OpenID Callback

`GET /api/auth/steam/callback`

### Purpose
Validate the state cookie and Steam OpenID assertion, import the player's Steam
profile and owned games, optionally enrich games with IGDB metadata, and create
a one-time authorization code.

This endpoint is called by Steam. It is not intended for direct API clients.

### Success Response
`302 Found` to:

```text
CLIENT_URL/auth/callback?code=<one-time-code>
```

The code expires after 60 seconds and can be consumed once.

### Error Response
`302 Found` to `CLIENT_URL/auth/callback?error=<reason>`, where reason is:
- `invalid_callback`
- `invalid_state`
- `steam_auth_failed`

## 3) Exchange Authorization Code

`POST /api/auth/steam/exchange`

### Auth Requirement
No prior JWT required.

### Request Body

```json
{
  "code": "string"
}
```

### Success Response (`200`)

```json
{
  "accessToken": "string",
  "expiresIn": 3600,
  "user": {
    "id": "usr_xxx",
    "steamId": "7656119xxxxxxxxxx",
    "username": "string",
    "avatarUrl": "https://..."
  }
}
```

### Error Responses
- `400 INVALID_BODY` invalid request payload
- `401 INVALID_AUTH_CODE` code is invalid, expired, or already consumed
- `500` internal error

## 4) Player Profile

`GET /api/users/:userId/profile`

### Purpose
Return user profile with library aggregates used by the app homepage.

### Auth Requirement
JWT required.

### Path Params
- `userId: string`

### Success Response (`200`)

```json
{
  "id": "usr_xxx",
  "steamId": "7656119xxxxxxxxxx",
  "username": "string",
  "avatarUrl": "https://...",
  "gameCount": 124,
  "totalPlaytimeMinutes": 58213,
  "topGenres": [
    {
      "name": "RPG",
      "playtimeMinutes": 18910
    }
  ],
  "recentGames": [
    {
      "gameId": "game_xxx",
      "name": "Elden Ring",
      "playtimeMinutes": 4212,
      "lastPlayedAt": "2026-05-10T14:00:00.000Z"
    }
  ]
}
```

### Error Responses
- `401` missing or invalid token
- `404` user not found
- `500` internal error

## 5) Taste Overlap Compatibility

`GET /api/compatibility/:userA/:userB`

### Purpose
Calculate compatibility using weighted Jaccard over normalized genre playtime distributions.

### Auth Requirement
JWT required.

### Path Params
- `userA: string`
- `userB: string`

### Success Response (`200`)

```json
{
  "userA": "usr_a",
  "userB": "usr_b",
  "overlapIndex": 0.5688,
  "overlapPercentage": 57,
  "presenceOverlapIndex": 0.4,
  "method": "weighted-jaccard-playtime",
  "sharedGenres": ["RPG", "Action"],
  "uniqueToA": ["Strategy"],
  "uniqueToB": ["Simulation"],
  "commonGames": [
    {
      "gameId": "game_7346",
      "name": "Elden Ring",
      "userAPlaytimeMinutes": 4200,
      "userBPlaytimeMinutes": 2750
    }
  ],
  "genreBreakdown": [
    {
      "genre": "Action",
      "userAWeight": 0.5,
      "userBWeight": 0.3809
    }
  ],
  "debug": {
    "intersectionCount": 2,
    "unionCount": 5,
    "weightedIntersection": 0.7251,
    "weightedUnion": 1.2749
  }
}
```

### Error Responses
- `400` invalid users or same user comparison not allowed
- `401` missing or invalid token
- `404` one or both users not found
- `500` internal error

## Error Payload Shape (common)

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "requestId": "req_xxx"
  }
}
```
