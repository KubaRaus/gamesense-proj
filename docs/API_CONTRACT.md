# GameSense API Contract (Prototype v0.1)

Base URL: `/api`
Auth: `Authorization: Bearer <accessToken>`
Content-Type: `application/json`

## 1) Auth via Steam Callback

`POST /api/auth/steam/callback`

### Purpose
Finalize Steam authentication and issue application JWT.

### Auth Requirement
No prior JWT required.

### Request Body

```json
{
  "openIdResponse": "string"
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
- `400` invalid callback payload
- `401` steam authentication failed
- `500` internal error

## 2) Player Profile

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

## 3) Taste Overlap Compatibility

`GET /api/compatibility/:userA/:userB`

### Purpose
Calculate compatibility between two players using Jaccard index over genre sets.

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
  "overlapIndex": 0.57,
  "sharedGenres": ["RPG", "Action"],
  "uniqueToA": ["Strategy"],
  "uniqueToB": ["Simulation"],
  "debug": {
    "intersectionCount": 4,
    "unionCount": 7
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
