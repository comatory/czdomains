import { DB } from "sqlite";

import type {
  Domain,
  PaginatedList,
  PaginatedRecord,
  Pagination,
  RawDomain,
} from "../models/index.ts";
import { normalizeDomainFromDB, normalizeListFromDB } from "../models/index.ts";
import type { BrowseFilter } from "../constants/browse.ts";
import { FILTER_MEMBERS } from "../constants/browse.ts";
import { createOffsetFromPage, sanitizeLimit } from "../utils/pagination.ts";
import { sanitizeFilter } from "../utils/browse-filters.ts";

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

  getPaginatedList(
    pagination: Pagination,
    filter: BrowseFilter,
  ): PaginatedList<Domain> {
    const sanitizedLimit = sanitizeLimit(pagination.limit);
    const sanitizedFilter = sanitizeFilter(filter);
    const sanitizedOffset = createOffsetFromPage(
      pagination.page,
      sanitizedLimit,
    );
    const filterMembers = sanitizedFilter === "all"
      ? null
      : FILTER_MEMBERS[sanitizedFilter];
    const records = this.db.query<PaginatedRecord<RawDomain>>(
      `SELECT id,
                value,
                datetime(created_at, \'unixepoch\'),
                datetime(updated_at, \'unixepoch\'),
                COUNT() OVER() as totalCount
         FROM domains
         ${filterMembers ? `WHERE value BETWEEN ? AND ?` : ""}
         ORDER BY value
         LIMIT ? OFFSET ?`,
      filterMembers
        ? [
          filterMembers.start,
          filterMembers.end,
          sanitizedLimit,
          sanitizedOffset,
        ]
        : [sanitizedLimit, sanitizedOffset],
    );

    return normalizeListFromDB<PaginatedRecord<RawDomain>, Domain>(
      records,
      normalizeDomainFromDB,
      pagination,
    );
  }
}
