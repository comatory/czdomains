import { z } from 'zod';

export const domain = z.object({
  id: z.number(),
  value: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
});

export type Domain = z.infer<typeof domain>;
