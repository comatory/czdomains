import type { Pagination, PaginationResult } from "../models/index.ts";
import {
  ALLOWED_LIMITS,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from "../constants/pagination.ts";
import type { AllowedPaginationLimit } from "../constants/pagination.ts";
import { InvalidInputError } from "../errors/invalid-input.ts";

export function getPaginationDetailsFromQueryParams(url: URL): Pagination {
  const params = new URLSearchParams(url.searchParams);
  const limit = params.get("limit")
    ? Number(params.get("limit"))
    : DEFAULT_LIMIT;
  const page = params.get("page") ? Number(params.get("page")) : DEFAULT_PAGE;

  return { limit: sanitizeLimit(limit), page };
}

export function generateNextPageLink<T extends Record<string, string | number | boolean | symbol>>(
  url: URL,
  pagination: PaginationResult,
  extra?: T,
): string | null {
  if (pagination.page >= createTotalPages(pagination.total, pagination.limit)) {
    return null;
  }

  const page = normalizePageNumber(pagination.page + 1, pagination.total);

  const params = produceParameters({
    limit: pagination.limit,
    page,
    extra,
  });

  url.search = params.toString();

  return url.toString();
}

export function generatePrevPageLink<T extends Record<string, string | number | boolean | symbol>>(
  url: URL,
  pagination: PaginationResult,
  extra?: T,
): string | null {
  if (pagination.page <= 1) {
    return null;
  }

  const page = normalizePageNumber(pagination.page - 1, pagination.total);

  const params = produceParameters({
    limit: pagination.limit,
    page,
    extra,
  });

  url.search = params.toString();

  return url.toString();
}

function produceParameters<T extends Record<string, string | number | boolean | symbol>>({
  limit,
  page,
  extra,
}: {
  limit: number;
  page: number;
  extra?: T;
}): URLSearchParams {
  const params = new URLSearchParams();

  params.set("limit", limit.toString());
  params.set("page", page.toString());

  if (extra) {
    Object.keys(extra).forEach((key) => {
      if (extra[key]) {
        params.set(key, extra[key].toString())
      }
    });
  }

  return params;
}

export function normalizePageNumber(page: number, total: number): number {
  return Math.min(Math.max(page, 0), total);
}

export function sanitizeLimit(limit: number): AllowedPaginationLimit | never {
  if (!isValidLimit(limit)) {
    throw new InvalidInputError(`Invalid limit value ${limit}`);
  }

  return limit;
}

function isValidLimit(limit: number): limit is AllowedPaginationLimit {
  return ALLOWED_LIMITS.includes(limit as AllowedPaginationLimit);
}

export function createOffsetFromPage(
  page: number,
  limit: AllowedPaginationLimit,
): number {
  return Math.max(page - 1, 0) * limit;
}

export function createTotalPages(
  count: number,
  limit: AllowedPaginationLimit,
): number {
  return Math.ceil(count / limit);
}
