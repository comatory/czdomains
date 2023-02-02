export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 50;
export const DEFAULT_PAGE = 0;
export const ALLOWED_LIMITS = [
  25,
  DEFAULT_LIMIT,
  100,
] as const;

export type AllowedPaginationLimit = typeof ALLOWED_LIMITS[number];
