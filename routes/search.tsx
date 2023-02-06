import { Handlers, PageProps } from "$fresh/server.ts";

import Header from "../components/header.tsx";
import Heading from "../components/heading.tsx";
import NavBar from "../components/nav-bar.tsx";
import Section from "../components/section.tsx";
import { domainsRepository } from "../services/instances.ts";
import { getPaginationDetailsFromQueryParams } from "../utils/pagination.ts";
import {
  getSearchFilterFromQueryParams,
  getSearchFiltersFromQueryParams,
} from "../utils/search-filters.ts";
import type { PaginatedList } from "../models/pagination.ts";
import type { Domain } from "../models/domain.ts";
import { InvalidInputError } from "../errors/invalid-input.ts";

type Data = {
  paginatedList: PaginatedList<Domain>;
  url: URL;
};

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    try {
      const records = domainsRepository.getPaginatedListSearch(
        getPaginationDetailsFromQueryParams(url),
        getSearchFiltersFromQueryParams(url),
      );

      return ctx.render({
        paginatedList: records,
        url,
      });
    } catch (error: unknown) {
      if (error instanceof InvalidInputError) {
        return new Response(null, {
          status: 400,
          headers: new Headers({
            location: new URL(req.url).origin,
          }),
        });
      }
      return new Response(null, {
        status: 500,
        headers: new Headers({
          location: new URL(req.url).origin,
        }),
      });
    }
  },
};

export default function Search({ data }: PageProps<Data>) {
  const search = getSearchFilterFromQueryParams(data.url);

  return (
    <>
      <Header />
      <Heading />
      <Section>
        <NavBar />
        <h4>Search</h4>
        <form
          action={data.url.pathname}
          method="GET"
        >
          <input name="q" type="text" value={search} />
          <input
            name="page"
            type="hidden"
            value={data.paginatedList.pagination.page}
          />
          <input
            name="limit"
            type="hidden"
            value={data.paginatedList.pagination.limit}
          />
          <input type="submit" value="Search" />
        </form>
        <div>
          {data.paginatedList.list.length}
        </div>
      </Section>
    </>
  );
}
