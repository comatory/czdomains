import { DB } from "sqlite";

import type {
  Domain,
  PaginatedList,
  PaginatedRecord,
  Pagination,
  RawDomain,
} from "../models/index.ts";
import { normalizeDomainFromDB, normalizeListFromDB } from "../models/index.ts";

export class DomainsRepository {
  private db: DB;

  constructor({
    db,
  }: {
    db: DB;
  }) {
    this.db = db;
  }

  public getDomainDetail(id: Domain["id"]): Domain | null {
    const records = this.db.query<RawDomain>(
      `SELECT id,
              value,
              datetime(created_at, \'unixepoch\'),
              datetime(updated_at, \'unixepoch\')
       FROM domains
       WHERE id = $id`,
      { id },
    );
    const record = records?.[0];

    if (!record) {
      return null;
    }

    return normalizeDomainFromDB(record);
  }

  getPaginatedList(pagination: Pagination): PaginatedList<Domain> {
    const records = this.db.query<PaginatedRecord<RawDomain>>(
      `SELECT id,
                value,
                datetime(created_at, \'unixepoch\'),
                datetime(updated_at, \'unixepoch\'),
                COUNT() OVER() as totalCount
         FROM domains
         ORDER BY value
         LIMIT ? OFFSET ?`,
      [pagination.limit, pagination.offset],
    );

    return normalizeListFromDB<PaginatedRecord<RawDomain>, Domain>(
      records,
      normalizeDomainFromDB,
      pagination,
    );
  }
}
