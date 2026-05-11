import { z } from "zod";

export const gamesSearchQuerySchema = z.object({
  q: z.string().trim().min(1),
  limit: z.coerce.number().int().min(1).max(50).optional()
});

export type GamesSearchQuery = z.infer<typeof gamesSearchQuerySchema>;
