import {
  AbstractMigration,
  ClientSQLite,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import type { DB } from "sqlite";
import * as v1 from "uuid/";

function uuid(): string {
  return v1.generate().toString();
}

export default class extends AbstractMigration<ClientSQLite> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    (this.client as unknown as DB).createFunction(uuid, { name: 'uuid' });
    this.client.query(`ALTER TABLE domains
          ADD COLUMN uuid TEXT NOT NULL DEFAULT uuid();`);
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
      (this.client as unknown as DB).deleteFunction('uuid');
      this.client.query('ALTER TABLE domains DROP COLUMN uuid;');
  }
}
