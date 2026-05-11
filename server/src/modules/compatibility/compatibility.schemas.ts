import { z } from "zod";

export const compatibilityParamsSchema = z.object({
  userA: z.string().min(1),
  userB: z.string().min(1)
});

export type CompatibilityParams = z.infer<typeof compatibilityParamsSchema>;
