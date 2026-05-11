import { z } from "zod";

export const steamCallbackBodySchema = z.object({
  openIdResponse: z.string().min(1)
});

export type SteamCallbackBody = z.infer<typeof steamCallbackBodySchema>;
