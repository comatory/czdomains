import type { Database } from 'sqlite';

import { domain } from '../models/domain';
import type { Domain } from '../models/domain';

export async function getDomains(db: Database): Promise<Domain[]> {
  const rows = (
    await db.all<Array<Record<string, unknown>>>(
      'SELECT * FROM domains LIMIT 100',
    )
  ).map((row) => domain.parse(row));

  return rows;
}
