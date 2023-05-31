import type { Database } from 'sqlite';

import { domain } from '../models/domain';
import type { Domain } from '../models/domain';

export async function getDomains(
  db: Database,
  {
    page,
    size,
  }: {
    page: number;
    size: number;
  },
): Promise<Domain[]> {
  const rows = (
    await db.all<Array<Record<string, unknown>>>(
      'SELECT * FROM domains ORDER BY value ASC LIMIT $limit OFFSET $offset;',
      {
        $offset: page * size,
        $limit: size,
      },
    )
  ).map((row) => domain.parse(row));

  return rows;
}
