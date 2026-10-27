import { z } from "zod";

export const steamCallbackQuerySchema = z.object({
  state: z.string().min(32)
});

export const steamExchangeBodySchema = z.object({
  code: z.string().min(32)
});
