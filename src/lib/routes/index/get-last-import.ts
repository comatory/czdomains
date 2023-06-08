import type { Database } from 'sqlite';

export async function getLastImport(db: Database): Promise<Date | null> {
  const rows = await db.all<Array<Record<string, unknown>>>(
    'SELECT MAX(created_at) as lastImport FROM imports;',
  );
  const row = rows[0]?.lastImport;

  return typeof row === 'string' ? new Date(row) : null;
}
