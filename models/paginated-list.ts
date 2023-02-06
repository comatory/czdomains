import type { PaginatedList, Pagination } from "./pagination.ts";

function isNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

function getTotalCountFieldValue(field: unknown): number {
  if (!isArray(field)) {
    return 0;
  }
  const lastItem = field[field.length - 1];

  return isNumber(lastItem) ? lastItem : 0;
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
  const totalCount = getTotalCountFieldValue(records[0]);

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
