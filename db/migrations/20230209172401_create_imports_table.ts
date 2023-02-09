import {
  AbstractMigration,
  ClientSQLite,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

const MAX_VARIABLES_CHUNK_SIZE = 32765;

export default class extends AbstractMigration<ClientSQLite> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    try {
      this.client.query("BEGIN;");
      this.client.query(`CREATE TABLE imports
            (id INTEGER PRIMARY KEY,
             created_at INTEGER NOT NULL UNIQUE
            );`);
      this.client.query(`ALTER TABLE domains
            ADD COLUMN import_id INTEGER REFERENCES domains(id);`);
      const rows = this.client.query<[number]>(
        "SELECT created_at FROM domains GROUP BY created_at;",
      );

      for (const [createdAt] of rows) {
        const [newImportIds] = this.client.query<[number]>(
          "INSERT INTO imports (created_at) VALUES (?) RETURNING id;",
          [
            createdAt,
          ],
        );
        const importId = newImportIds[0];
        const domainRows = this.client.query<[number]>(
          "SELECT id FROM domains WHERE created_at = ?;",
          [createdAt],
        );

        const chunkedValues = domainRows.reduce((array, value, i) => {
          if (i % MAX_VARIABLES_CHUNK_SIZE === 0) {
            return [...array, [value[0]]];
          }

          const lastIndex = Math.max(array.length - 1, 0);
          array[lastIndex] ??= [];
          array[lastIndex].push(value[0]);
          return array;
        }, [] as number[][]);

        for (const chunkValue of chunkedValues) {
          this.client.query(
            `UPDATE domains SET import_id = ? WHERE id IN (${
              Array(chunkValue.length).fill("?").join(",")
            });`,
            [importId, ...chunkValue],
          );
        }
      }
      this.client.query("ALTER TABLE domains DROP COLUMN created_at;");
      this.client.query("COMMIT;");
    } catch (error) {
      this.client.query("ROLLBACK;");
      console.error(error);
      Deno.exit(1);
    }
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    try {
      this.client.query("BEGIN;");
      this.client.query(
        "ALTER TABLE domains ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;",
      );

      const rows = this.client.query<[number, number]>(
        "SELECT id, created_at FROM imports;",
      );

      for (const [importId, createdAt] of rows) {
        this.client.query(
          "UPDATE domains SET created_at = ? WHERE import_id = ?;",
          [createdAt, importId],
        );
        this.client.query("DELETE FROM imports WHERE id = ?;", [importId]);
      }

      this.client.query("ALTER TABLE domains DROP COLUMN import_id;");
      this.client.query("DROP TABLE imports;");
      this.client.query("COMMIT;");
    } catch (error) {
      this.client.query("ROLLBACK;");
      console.error(error);
      Deno.exit(1);
    }
  }
}
