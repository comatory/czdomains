import { join } from 'node:path';

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function createDatabase() {
  const db = await open({
    filename: join(__dirname, '..', 'sqlite.db'),
    driver: sqlite3.Database,
  });

  return db;
}
