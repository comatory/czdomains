import { useMemo } from "preact/hooks";

import {
  createTotalPages,
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
  const currentPage = useMemo(
    () => normalizePageNumber(pagination.page, pagination.total),
    [pagination],
  );

  return (
    <nav className="pagination-panel">
      <ul className="pagination-panel__list">
        <li className="pagination-panel__list__item">
          {prevLink !== null
            ? (
              <a href={prevLink}>
                Prev
              </a>
            )
            : "Prev"}
        </li>
        <li className="pagination-panel__list__item">
          <form
            method="GET"
            action={url.pathname}
            className="pagination-panel__list__item__page-form"
          >
            <input
              type="text"
              name="page"
              value={currentPage}
              size={(currentPage).toString().length}
              className="pagination-panel__list__item__page-form__input"
            />
            <input type="hidden" name="limit" value={pagination.limit} />
            <span>/</span>
            <span class="pagination-panel__list__item__page-form__counter">
              {createTotalPages(pagination.total, pagination.limit)}
            </span>
          </form>
        </li>
        <li className="pagination-panel__list__item">
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
