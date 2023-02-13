import type {
  PaginatedList,
  PaginatedRecord,
  Pagination,
} from "./pagination.ts";

export function normalizeListFromDB<
  DBRecord extends Record<string, unknown>,
  NormalizedRecord extends Record<string, unknown>,
>(
  records: PaginatedRecord<DBRecord>[],
  normalizerFn: (record: DBRecord) => NormalizedRecord,
  pagination: Pagination,
): PaginatedList<NormalizedRecord> {
  const normalizedRecords = records.map(normalizerFn);
  const totalCount = records[0]?.totalCount;

  const paginatedList: PaginatedList<NormalizedRecord> = {
    list: normalizedRecords,
    pagination: {
      ...pagination,
      total: totalCount,
    },
  };

  return paginatedList;
}

export function emptyPaginatedList<
  NormalizedRecord extends Record<string, unknown>,
>(
  pagination: Pagination,
) {
  const paginatedList: PaginatedList<NormalizedRecord> = {
    list: [],
    pagination: {
      ...pagination,
      total: 0,
    },
  };

  return paginatedList;
}
