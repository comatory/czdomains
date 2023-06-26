import { z } from 'zod';

export const domain = z.object({
  id: z.number(),
  value: z.string(),
  uuid: z.string(),
});

export type Domain = z.infer<typeof domain>;
