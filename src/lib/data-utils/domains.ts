import type { Database } from 'sqlite';

import { domain } from '../models/domain';
import type { Domain } from '../models/domain';
import type { BrowseParamsSchema } from '../types/params';
import type { BrowseQueryStringSchema } from '../types/querystring';

const BROWSE_FILTER_MAP: Record<
  BrowseParamsSchema['filter'],
  { start: string; end: string }
> = {
  all: { start: '', end: '' },
  numbers: { start: '0', end: '9' },
  a_e: { start: 'a', end: 'e' },
  f_j: { start: 'f', end: 'j' },
  k_o: { start: 'k', end: 'o' },
  p_t: { start: 'p', end: 't' },
  u_z: { start: 'u', end: 'z' },
} as const;

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
  const { start, end } = BROWSE_FILTER_MAP[filter];

  const rows = (
    await db.all<Array<Record<string, unknown>>>(
      [
        'SELECT * FROM domains',
        start.length < 1 && end.length < 1
          ? ''
          : 'WHERE value BETWEEN $start AND $end',
        'ORDER BY value ASC',
        'LIMIT $limit',
        'OFFSET $offset;',
      ]
        .filter((text) => text.length > 0)
        .join(' '),
      {
        $offset: page * size,
        $limit: size,
        $start: start || undefined,
        $end: end || undefined,
      },
    )
  ).map((row) => domain.parse(row));

  return rows;
}
