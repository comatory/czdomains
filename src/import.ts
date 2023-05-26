import { readFile } from 'fs/promises';
import { join } from 'path';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { Database } from 'sqlite';
import yargs from 'yargs';

const cliOptions = yargs(process.argv.slice(2))
  .option('filePath', {
    alias: 'f',
    type: 'string',
    description: 'Path to file with domain names',
    demandOption: true,
  })
  .parseSync();

const HTTPS_RE = /^http(s?):\/\//i;
const WWW_RE = /^www\./i;
const MAX_VARIABLES_CHUNK_SIZE = 32766 / 2;

function normalizeDomain(value: string): string {
  let normalizedValue = value;

  if (HTTPS_RE.test(value)) {
    normalizedValue = normalizedValue.replace(HTTPS_RE, '');
  }

  if (WWW_RE.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(WWW_RE, '');
  }

  return normalizedValue;
}

function reportProcessedChunk(totalChunks: number, order: number): void {
  if (totalChunks < 2) {
    return;
  }

  console.info(`Chunk ${order}/${totalChunks} processed.`);
}

async function getImportIdByDate(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  date: string,
) {
  const row = await db.get<{ id: number }>(
    'SELECT id FROM imports WHERE created_at = ?',
    [date],
  );

  return row?.id ?? null;
}

async function insertDomains({
  db,
  chunk,
  totalChunks,
  order,
  now,
}: {
  db: Database;
  chunk: string[];
  totalChunks: number;
  order: number;
  now: string;
}): Promise<number> {
  try {
    await db.run('BEGIN;');
    const newImport = await db.get<{ id: number }>(
      'INSERT OR IGNORE INTO imports (created_at) VALUES (?) RETURNING id;',
      [now],
    );

    const importId = newImport
      ? newImport.id
      : await getImportIdByDate(db, now);

    const sql = `INSERT OR IGNORE INTO domains (value, import_id) VALUES ${chunk
      .map((_) => '(?, ?)')
      .join(',')};`;
    const values = chunk.flatMap((value) => [value, importId]);
    await db.run(sql, values);

    reportProcessedChunk(totalChunks, order);

    await db.run('COMMIT;');

    return values.length;
  } catch (e) {
    await db.run('ROLLBACK;');
    throw e;
  }
}

void (async ({ filePath }: typeof cliOptions) => {
  sqlite3.verbose();

  const fileContent = await readFile(filePath);

  console.info('Opening file...');

  const lines = fileContent.toString().split('\n');

  console.info('Normalizing domain names...');

  const normalizedValues = lines.map(normalizeDomain);

  console.info('Connecting to database...');

  const dbPath = join(__dirname, '..', './sqlite.db');
  const db = await open<sqlite3.Database, sqlite3.Statement>({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const chunkedValues = normalizedValues.reduce((array, value, i) => {
    if (i % MAX_VARIABLES_CHUNK_SIZE === 0) {
      return [...array, [value]];
    }

    const lastIndex = Math.max(array.length - 1, 0);
    array[lastIndex] ??= [];
    array[lastIndex].push(value);
    return array;
  }, [] as string[][]);

  console.info('Writing to database...');

  let rowsWritten = 0;

  const now = new Date().toISOString();

  for (const chunk of chunkedValues) {
    const order = chunkedValues.indexOf(chunk) + 1;
    const total = chunkedValues.length;

    rowsWritten = await insertDomains({
      db,
      chunk,
      totalChunks: total,
      order,
      now,
    });
  }

  const ignoredRows = normalizedValues.length - rowsWritten;
  const info = `${rowsWritten} rows created out of ${
    normalizedValues.length
  } records.${ignoredRows > 0 ? `${ignoredRows} rows ignored.` : ''}`;
  console.info(info);

  db.close();
})(cliOptions);
