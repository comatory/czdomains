import type { Database } from 'sqlite';

import { domain } from '../../models/domain';
import { normalizePageCount } from '../../utils/pagination';
import type { SearchQueryStringSchema } from '../../types/schemas';
import type { Domain } from '../../models/domain';

export async function searchDomains(
  db: Database,
  {
    page,
    size,
    q,
  }: {
    page: SearchQueryStringSchema['page'];
    size: SearchQueryStringSchema['size'];
    q: SearchQueryStringSchema['q'];
  },
): Promise<{
  rows: Domain[];
  totalCount: number;
}> {
  const rows = await db.all<Array<Record<string, unknown>>>(
    [
      'SELECT id, value, uuid, COUNT() OVER() as totalCount',
      'FROM domains',
      'WHERE VALUE LIKE $search',
      'ORDER BY value ASC',
      'LIMIT $limit',
      'OFFSET $offset',
    ].join(' '),
    {
      $offset: page * size,
      $limit: size,
      $search: `%${q}%`,
    },
  );

  const domainRows = rows.map((row) => domain.parse(row));
  const count = normalizePageCount(rows[0].totalCount, size);

  return {
    rows: domainRows,
    totalCount: count,
  };
}
