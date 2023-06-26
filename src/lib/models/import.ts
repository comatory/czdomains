import { z } from 'zod';

function parseDateString(value: string): Date | null {
  const maybeDate = new Date(value);

  if (Number.isNaN(maybeDate.getTime())) {
    return null;
  }

  return maybeDate;
}

export const importEntry = z.object({
  id: z.number(),
  created_at: z.string().transform(parseDateString),
});

export type Import = z.infer<typeof importEntry>;
