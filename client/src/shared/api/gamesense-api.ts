import type {
  AuthSteamCallbackResponse,
  CompatibilityResponse,
  GameSearchResponse,
  UserProfileResponse
} from "@gamesense/types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type RequestMethod = "GET" | "POST";

interface RequestOptions {
  method?: RequestMethod;
  token?: string;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function authenticateWithSteam(openIdResponse: string) {
  return request<AuthSteamCallbackResponse>("/auth/steam/callback", {
    method: "POST",
    body: { openIdResponse }
  });
}

export function searchGames(query: string, limit?: number) {
  const params = new URLSearchParams({ q: query });
  if (limit) {
    params.set("limit", String(limit));
  }

  return request<GameSearchResponse>(`/games/search?${params.toString()}`);
}

export function getUserProfile(userId: string, token: string) {
  return request<UserProfileResponse>(`/users/${userId}/profile`, { token });
}

export function getCompatibility(userA: string, userB: string, token: string) {
  return request<CompatibilityResponse>(`/compatibility/${userA}/${userB}`, { token });
}
