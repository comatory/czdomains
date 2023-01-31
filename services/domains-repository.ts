import { DB } from "sqlite";

import type {
  Domain,
  PaginatedList,
  PaginatedRecord,
  Pagination,
  RawDomain,
} from "../models/index.ts";
import { normalizeDomainFromDB, normalizeListFromDB } from "../models/index.ts";

type DomainsRepository = {
  getDomainDetail: (id: Domain["id"]) => Domain | null;
  getPaginatedList: (pagination: Pagination) => PaginatedList<Domain>;
};

export function DomainsRepositoryFactory({
  db,
}: {
  db: DB;
}): DomainsRepository {
  function getDomainDetail(id: Domain["id"]) {
    const records = db.query<RawDomain>(
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

  function getPaginatedList(pagination: Pagination) {
    const records = db.query<PaginatedRecord<RawDomain>>(
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

  return {
    getDomainDetail,
    getPaginatedList,
  };
}
