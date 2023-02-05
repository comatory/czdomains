export type Pagination = {
  limit: number;
  page: number;
};

export type PaginationResult = {
  limit: Pagination["limit"];
  total: number;
  page: number;
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
