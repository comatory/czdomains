import { join } from 'node:path';
import { cwd } from 'node:process';

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function createDatabase({ dbFilePath }: { dbFilePath?: string }) {
  const db = await open({
    filename: join(cwd(), dbFilePath ?? 'sqlite.db'),
    driver: sqlite3.Database,
  });

  if (process.env.NODE_ENV === 'development') {
    db.on('trace', (query: string) => {
      console.info(query);
    });
  }

  return db;
}
