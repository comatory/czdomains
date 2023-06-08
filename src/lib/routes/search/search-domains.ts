import type { Database } from 'sqlite';

import { domain } from '../../models/domain';
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

  const maybeCount = rows.length > 0 ? rows[0].totalCount : 0;
  const domainRows = rows.map((row) => domain.parse(row));
  const count: number = typeof maybeCount === 'number' ? maybeCount : 0;

  return {
    rows: domainRows,
    totalCount: Math.round(count / size),
  };
}
