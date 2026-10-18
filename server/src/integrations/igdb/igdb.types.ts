export interface IgdbCredentials {
  clientId: string;
  clientSecret: string;
}

export interface IgdbAccessToken {
  accessToken: string;
  expiresAt: number;
}

export interface IgdbApiGame {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: {
    image_id?: string;
  };
  genres?: Array<{
    name?: string;
  }>;
}
