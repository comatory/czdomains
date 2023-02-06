import { useMemo } from "preact/hooks";

import {
  generateNextPageLink,
  generatePrevPageLink,
  normalizePageNumber,
  createTotalPages,
} from "../../utils/pagination.ts";
import type { PaginationResult } from "../../models/index.ts";

export default function ({
  url,
  pagination,
}: {
  pagination: PaginationResult;
  url: URL;
}) {
  const prevLink = useMemo(() => generatePrevPageLink(url, pagination), [
    url,
    pagination,
  ]);
  const nextLink = useMemo(() => generateNextPageLink(url, pagination), [
    url,
    pagination,
  ]);
  const currentPage = useMemo(() => normalizePageNumber(pagination.page, pagination.total),[ pagination ])

  return (
    <nav>
      <ul>
        <li>
          {prevLink !== null
            ? (
              <a href={prevLink}>
                Prev
              </a>
            )
            : "Prev"}
        </li>
        <li>
          <form method='GET' action={url.pathname}>
            <input
              type="text"
              name='page'
              value={currentPage}
            />
            <input type='hidden' name='limit' value={pagination.limit} />
            <span>/{createTotalPages(pagination.total, pagination.limit)}</span>
          </form>
          
        </li>
        <li>
          {nextLink !== null
            ? (
              <a href={nextLink}>
                Next
              </a>
            )
            : "Next"}
        </li>
      </ul>
    </nav>
  );
}
