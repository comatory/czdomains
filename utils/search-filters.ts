import type { SearchFilter, SearchFilters, IgnoredSearchFilters, IgnoredSearchFilter } from "../constants/search.ts";
import { SEARCH_FILTERS, IGNORED_SEARCH_FILTERS } from "../constants/search.ts";
import { InvalidInputError } from "../errors/invalid-input.ts";

function isValidFilterKey(param: string): param is SearchFilter {
  return param in SEARCH_FILTERS;
}

function isIgnoredFilterKey(param: string): param is IgnoredSearchFilter {
  return param in IGNORED_SEARCH_FILTERS;
}

export function sanitizeFilterKey(param: string): SearchFilter | null | never {
  const valid = isValidFilterKey(param);
  const ignored = isIgnoredFilterKey(param);
  if (param.length > 0 && !valid && !ignored) {
    throw new InvalidInputError(`Search filter ${param} not recognized.`);
  }

  if (param.length < 1 || ignored) {
    return null;
  }

  return param as SearchFilter;
}

export function sanitizeSearchFilter(value: unknown): string | never {
  if (typeof value !== "string") {
    throw new InvalidInputError(`Value ${value} not allowed.`);
  }

  return value;
}

export function getSearchFilterQueryFromQueryParams(url: URL): string | null {
  const query = new URLSearchParams(url.search).get("q");
  return query ?? null;
}

export function getSearchFiltersFromQueryParams(
  url: URL,
): Partial<SearchFilters> {
  const params = new URLSearchParams(url.search);
  const filters = Array.from(params.entries()).reduce(
    (filters, [queryKey, queryValue]) => {
      const key = sanitizeFilterKey(queryKey);

      if (key === null) {
        return filters;
      }

      return {
        ...filters,
        [key]: queryValue,
      };
    },
    {},
  );

  return filters;
}
