export const SEARCH_FILTERS = {
  q: "q",
} as const;
export const IGNORED_SEARCH_FILTERS = {
  page: "page",
  limit: "limit",
} as const;

export type SearchFilter = typeof SEARCH_FILTERS[keyof typeof SEARCH_FILTERS];
export type SearchFilters = typeof SEARCH_FILTERS;
export type IgnoredSearchFilter = typeof IGNORED_SEARCH_FILTERS[keyof typeof IGNORED_SEARCH_FILTERS];
export type IgnoredSearchFilters = typeof IGNORED_SEARCH_FILTERS;

