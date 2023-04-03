import { DB } from "sqlite";
import * as uuid from '$std/uuid/mod.ts';

const filePath = Deno.args[0];

const HTTPS_RE = /^http(s?):\/\//i;
const WWW_RE = /^www\./i;
const MAX_VARIABLES_CHUNK_SIZE = 32766 / 2;

function normalizeDomain(value: string): string {
  let normalizedValue = value;

  if (HTTPS_RE.test(value)) {
    normalizedValue = normalizedValue.replace(HTTPS_RE, "");
  }

  if (WWW_RE.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(WWW_RE, "");
  }

  return normalizedValue;
}

if (!filePath) {
  console.info("Usage: deno task import:data <path>");
  Deno.exit(1);
}

const fileContent = await Deno.readTextFile(filePath);

console.info("Opening file...");

const lines = fileContent.split("\n");

console.info("Normalizing domain names...");

const normalizedValues = lines.map(normalizeDomain);

console.info("Connecting to database...");

const dbPath = await Deno.realPath("./sqlite.db");
const db = new DB(dbPath, { mode: "create" });

const hasImportsTable = checkIfImportsTableExists();
const hasUuids = checkIfUUidsExist();

const chunkedValues = normalizedValues.reduce((array, value, i) => {
  if (i % MAX_VARIABLES_CHUNK_SIZE === 0) {
    return [...array, [value]];
  }

  const lastIndex = Math.max(array.length - 1, 0);
  array[lastIndex] ??= [];
  array[lastIndex].push(value);
  return array;
}, [] as string[][]);

console.info("Writing to database...");

const now = Math.ceil(new Date().getTime() / 1000);

let rowsWritten = 0;

for (const chunk of chunkedValues) {
  const order = chunkedValues.indexOf(chunk) + 1;
  const total = chunkedValues.length;

  rowsWritten += hasImportsTable
    ? insertDomainsV2(
      chunk,
      total,
      order,
    )
    : insertDomainsV1(
      chunk,
      total,
      order,
    );

  if (hasUuids) {
    const _uuid = chunk.flatMap((value) => [value, uuid.v4() ]);
  }
}

const ignoredRows = normalizedValues.length - rowsWritten;
const info =
  `${rowsWritten} rows created out of ${normalizedValues.length} records.${
    ignoredRows > 0 ? `${ignoredRows} rows ignored.` : ""
  }`;
console.info(info);

db.close();

function insertDomainsV1(
  chunk: string[],
  totalChunks: number,
  order: number,
): number {
  const sql = `INSERT OR IGNORE INTO domains (value, created_at) VALUES ${
    chunk.map((_) => "(?, ?)").join(",")
  };`;
  const values = chunk.flatMap((value) => [value, now]);
  db.query(sql, values);

  reportProcessedChunk(totalChunks, order);

  return db.changes;
}

function insertDomainsV2(
  chunk: string[],
  totalChunks: number,
  order: number,
): number {
  try {
    db.query("BEGIN;");
    const rows = db.query<[number]>(
      "INSERT OR IGNORE INTO imports (created_at) VALUES (?) RETURNING id;",
      [now],
    );
    const [importIds] = rows.length > 0
      ? rows
      : db.query<[number]>("SELECT id FROM imports WHERE created_at = ?", [
        now,
      ]);
    const importId = importIds[0];

    const sql = `INSERT OR IGNORE INTO domains (value, import_id) VALUES ${
      chunk.map((_) => "(?, ?)").join(",")
    };`;
    const values = chunk.flatMap((value) => [value, importId]);
    db.query(sql, values);

    reportProcessedChunk(totalChunks, order);

    db.query("COMMIT;");

    return db.changes;
  } catch (e) {
    db.query("ROLLBACK;");
    throw e;
  }
}

function reportProcessedChunk(totalChunks: number, order: number): void {
  if (totalChunks < 2) {
    return;
  }

  console.info(
    `Chunk ${order}/${totalChunks} processed.`,
  );
}

function checkIfImportsTableExists(): boolean {
  try {
    db.query<[string]>("SELECT id FROM imports LIMIT 1;");
    return true;
  } catch (_) {
    return false;
  }
}

function checkIfUUidsExist(): boolean {
  try {
    db.query<[string]>("SELECT uuid FROM domains;");
    return true;
  } catch (_) {
    return false;
  }
}
