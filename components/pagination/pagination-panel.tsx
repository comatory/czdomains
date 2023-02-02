import { useMemo } from "preact/hooks";

import {
  generateNextPageLink,
  generatePrevPageLink,
  normalizePageNumber,
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
          {normalizePageNumber(
            pagination.page + 1,
            pagination.total,
          )}/{pagination.total}
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
