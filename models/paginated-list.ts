import type { PaginatedList, Pagination } from "./pagination.ts";

function isNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

function getTotalCountFieldValue(field: unknown): number {
  return isNumber(field) ? field : 0;
}

export function normalizeListFromDB<
  DBRecord,
  NormalizedRecord extends Record<string, unknown>,
>(
  records: DBRecord[],
  normalizerFn: (record: DBRecord) => NormalizedRecord,
  pagination: Pagination,
): PaginatedList<NormalizedRecord> {
  const normalizedRecords = records.map(normalizerFn);
  const totalCount = getTotalCountFieldValue(records[records.length - 1]);

  const paginatedList: PaginatedList<NormalizedRecord> = {
    list: normalizedRecords,
    pagination: {
      ...pagination,
      total: totalCount,
    },
  };

  return paginatedList;
}
