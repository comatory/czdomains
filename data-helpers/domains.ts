import { DB } from "sqlite";

import type {
  Domain,
  PaginatedList,
  PaginatedRecord,
  Pagination,
  RawDomain,
} from "../models/index.ts";
import {
  emptyPaginatedList,
  normalizeDomainFromDB,
  normalizeListFromDB,
} from "../models/index.ts";
import { db } from "../services/db.ts";
import type { BrowseFilter } from "../constants/browse.ts";
import type { SearchFilters } from "../constants/search.ts";
import { FILTER_MEMBERS } from "../constants/browse.ts";
import { createOffsetFromPage, sanitizeLimit } from "../utils/pagination.ts";
import { sanitizeFilter as sanitizeBrowseFilter } from "../utils/browse-filters.ts";
import { sanitizeSearchFilter } from "../utils/search-filters.ts";

function createGetDomainDetail(db: DB) {
  return function getDomainDetail(id: Domain["id"]): Domain | null {
    const records = db.queryEntries<RawDomain>(
      `SELECT id,
              value,
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
  };
}

function createGetPaginatedList(db: DB) {
  return function getPaginatedList(
    pagination: Pagination,
    filter: BrowseFilter,
  ): PaginatedList<Domain> {
    const sanitizedLimit = sanitizeLimit(pagination.limit);
    const sanitizedFilter = sanitizeBrowseFilter(filter);
    const sanitizedOffset = createOffsetFromPage(
      pagination.page,
      sanitizedLimit,
    );
    const filterMembers = sanitizedFilter === "all"
      ? null
      : FILTER_MEMBERS[sanitizedFilter];
    const records = db.queryEntries<PaginatedRecord<RawDomain>>(
      `SELECT id,
                value,
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

    return normalizeListFromDB<RawDomain, Domain>(
      records,
      normalizeDomainFromDB,
      pagination,
    );
  };
}

function createGetPaginatedListSearch(db: DB) {
  return function getPaginatedListSearch(
    pagination: Pagination,
    filters: Partial<SearchFilters>,
  ) {
    if (!filters.q) {
      return emptyPaginatedList<Domain>(pagination);
    }

    const sanitizedSearch = sanitizeSearchFilter(filters.q);
    const sanitizedLimit = sanitizeLimit(pagination.limit);
    const sanitizedOffset = createOffsetFromPage(
      pagination.page,
      sanitizedLimit,
    );

    const records = db.queryEntries<PaginatedRecord<RawDomain>>(
      `SELECT id,
                value,
                datetime(updated_at, \'unixepoch\'),
                COUNT() OVER() as totalCount
         FROM domains
         WHERE value LIKE ?
         ORDER BY value
         LIMIT ? OFFSET ?`,
      [`${sanitizedSearch}%`, sanitizedLimit, sanitizedOffset],
    );

    return normalizeListFromDB<RawDomain, Domain>(
      records,
      normalizeDomainFromDB,
      pagination,
    );
  };
}

export const getDomainDetail = createGetDomainDetail(db);
export const getPaginatedList = createGetPaginatedList(db);
export const getPaginatedListSearch = createGetPaginatedListSearch(db);
