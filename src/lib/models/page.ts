import { z } from 'zod';

export const page = z.object({
  current: z.number(),
  size: z.number(),
  total: z.number(),
});

export type Page = z.infer<typeof page>;
