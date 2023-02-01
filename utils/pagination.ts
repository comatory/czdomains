import type { Pagination, PaginationResult } from "../models/index.ts";

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 0;

export function getPaginationDetailsFromQueryParams(url: URL): Pagination {
  const params = new URLSearchParams(url.searchParams);
  const offset = params.get("offset")
    ? Number(params.get("offset"))
    : DEFAULT_OFFSET;
  const limit = params.get("limit")
    ? Number(params.get("limit"))
    : DEFAULT_LIMIT;
  const page = params.get("page") ? Number(params.get("page")) : DEFAULT_PAGE;

  return { offset, limit, page };
}

export function generateNextPageLink(
  root: string,
  pagination: PaginationResult,
): string | null {
  if (pagination.page + 1 >= pagination.total) {
    return null;
  }

  const url = new URL(root);
  const params = new URLSearchParams();
  const page = normalizePageNumber(pagination.page + 1, pagination.total);

  params.set("limit", pagination.limit.toString());
  params.set("page", page.toString());
  params.set("offset", (page * pagination.limit).toString());

  url.search = params.toString();

  return url.toString();
}

export function generatePrevPageLink(
  root: string,
  pagination: PaginationResult,
): string | null {
  if (pagination.page <= 0) {
    return null;
  }

  const url = new URL(root);
  const params = new URLSearchParams();
  const page = normalizePageNumber(pagination.page - 1, pagination.total);

  params.set("limit", pagination.limit.toString());
  params.set("page", page.toString());
  params.set("offset", (page * pagination.limit).toString());

  url.search = params.toString();

  return url.toString();
}

export function normalizePageNumber(page: number, total: number): number {
  return Math.min(Math.max(page, 0), total);
}
