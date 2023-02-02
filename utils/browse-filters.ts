import type { BrowseFilter } from "../constants/browse.ts";
import { BROWSE_FILTERS } from "../constants/browse.ts";

function isValidFilter(param: string): param is BrowseFilter {
  return param in BROWSE_FILTERS;
}

export function sanitizeFilter(param: string): BrowseFilter | never {
  if (!isValidFilter(param)) {
    throw new Error(`Filter not recognized`);
  }

  return param;
}

export function getBrowseFilterFromQueryParams(url: URL): BrowseFilter {
  const segments = url.pathname.split("/");
  const param = segments[segments.length - 1];
  const filter = sanitizeFilter(param);

  return filter;
}
