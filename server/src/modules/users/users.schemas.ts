import { z } from "zod";

export const userProfileParamsSchema = z.object({
  userId: z.string().min(1)
});

export type UserProfileParams = z.infer<typeof userProfileParamsSchema>;
