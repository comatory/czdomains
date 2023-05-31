import type { Database } from 'sqlite';

import { domain } from '../models/domain';
import type { Domain } from '../models/domain';
import type { BrowseParamsSchema } from '../types/params';
import type { BrowseQueryStringSchema } from '../types/querystring';

export async function getDomains(
  db: Database,
  {
    page,
    size,
    filter,
  }: {
    page: BrowseQueryStringSchema['page'];
    size: BrowseQueryStringSchema['size'];
    filter: BrowseParamsSchema['filter'];
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
