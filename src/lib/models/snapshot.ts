import { z } from 'zod';

function parseTimestamp(val: string): Date | null {
  const year = Number.parseInt(val.slice(0, 4), 10);
  const month = Number.parseInt(val.slice(4, 6), 10) - 1;
  const day = Number.parseInt(val.slice(6, 8), 10);
  const hour = Number.parseInt(val.slice(8, 10), 10);
  const minute = Number.parseInt(val.slice(10, 12), 10);
  const second = Number.parseInt(val.slice(12, 14), 10);

  const date = new Date(year, month, day, hour, minute, second);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export const snapshot = z.object({
  archived_snapshots: z.object({
    closest: z
      .object({
        available: z.boolean(),
        url: z.string().url(),
        timestamp: z.string().transform(parseTimestamp),
        status: z.string().transform((val) => Number.parseInt(val, 10)),
      })
      .optional(),
  }),
});

export type Snapshot = z.infer<typeof snapshot>;
