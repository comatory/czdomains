import type { Database } from 'sqlite';

import { domain } from '../../models/domain';
import { importEntry } from '../../models/import';
import type { Domain } from '../../models/domain';
import type { Import } from '../../models/import';
import type { DomainParamsSchema } from '../../types/schemas';

export async function getDomain(
  db: Database,
  {
    uuid,
  }: {
    uuid: DomainParamsSchema['uuid'];
  },
): Promise<{
  domain: Domain | null;
  importEntry: Import | null;
}> {
  const row = await db.get<Record<string, unknown>>(
    'SELECT id, value, uuid, import_id FROM domains WHERE uuid = $uuid;',
    {
      $uuid: uuid,
    },
  );

  const importRow = await db.get<Record<string, unknown>>(
    'SELECT id, created_at FROM imports WHERE id = $id;',
    {
      $id: row?.import_id,
    },
  );

  const selectedDomain = row ? domain.parse(row) : null;
  const selectedImportEntry = importRow ? importEntry.parse(importRow) : null;

  if (selectedDomain && selectedImportEntry) {
    console.log(typeof selectedImportEntry.created_at);
  }

  return {
    domain: selectedDomain,
    importEntry: selectedImportEntry,
  };
}
