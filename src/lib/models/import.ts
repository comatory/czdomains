import { z } from 'zod';

export const importEntry = z.object({
  id: z.number(),
  created_at: z.string().datetime(),
});

export type Import = z.infer<typeof importEntry>;
