import {
  AbstractMigration,
  ClientSQLite,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

export default class extends AbstractMigration<ClientSQLite> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    this.client.query(`CREATE TABLE domains
        (id INTEGER PRIMARY KEY,
         value TEXT NOT NULL UNIQUE,
         created_at INTEGER NOT NULL,
         updated_at INTEGER
         );`);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    this.client.query("DROP TABLE domains;");
  }
}
