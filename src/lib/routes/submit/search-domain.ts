import type { Database } from 'sqlite';

import type { Domain } from '../../models/domain';
import { domain } from '../../models/domain';

export async function searchDomain(
  db: Database,
  value: string,
): Promise<Domain | null> {
  const row = await db.get<Record<string, unknown>>(
    'SELECT id, value, uuid FROM domains WHERE value = $value;',
    {
      $value: value,
    },
  );

  if (!row) {
    return null;
  }

  return domain.parse(row);
}
