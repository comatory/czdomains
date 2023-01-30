import { DB } from "sqlite";

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
const chunkedValues = normalizedValues.reduce((array, value, i) => {
  if (i % MAX_VARIABLES_CHUNK_SIZE === 0) {
    return [...array, [value]];
  }

  const lastIndex = Math.max(array.length - 1, 0);
  array[lastIndex] ??= [];
  array[lastIndex].push(value);
  return array;
}, [] as string[][]);

console.info("Connecting to database...");

const dbPath = await Deno.realPath("./sqlite.db");
const db = new DB(dbPath, { mode: "create" });

console.info("Writing to database...");

const now = Math.ceil(new Date().getTime() / 1000);

let rowsWritten = 0;

for (const chunk of chunkedValues) {
  const sql = `INSERT OR IGNORE INTO domains (value, created_at) VALUES ${
    chunk.map((_) => "(?, ?)").join(",")
  };`;
  const values = chunk.flatMap((value) => [value, now]);
  db.query(sql, values);

  rowsWritten += db.changes;

  if (chunkedValues.length > 1) {
    console.info(
      `Chunk ${
        chunkedValues.indexOf(chunk) + 1
      }/${chunkedValues.length} processed.`,
    );
  }
}

const ignoredRows = normalizedValues.length - rowsWritten;
const info =
  `${rowsWritten} rows created out of ${normalizedValues.length} records.${
    ignoredRows > 0 ? `${ignoredRows} rows ignored.` : ""
  }`;
console.info(info);

db.close();
