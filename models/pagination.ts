export type Pagination = {
  offset: number;
  limit: number;
};

export type PaginationResult = {
  offset: Pagination["offset"];
  limit: Pagination["limit"];
  total: number;
};

export type PaginatedList<T extends Record<string, unknown>> = {
  pagination: PaginationResult;
  list: T[];
};

type PaginationFields = [number];

export type PaginatedRecord<T extends Array<unknown>> = [
  ...T,
  ...PaginationFields,
];
