import { Handlers, PageProps } from "$fresh/server.ts";

import Header from "../../components/header.tsx";
import Heading from "../../components/heading.tsx";
import NavBar from "../../components/nav-bar.tsx";
import Section from "../../components/section.tsx";

import { getPaginatedList } from "../../data-helpers/domains.ts";
import DomainList from "../../components/domain-list.tsx";
import PaginationPanel from "../../components/pagination/pagination-panel.tsx";
import NavMenu from "../../components/browse/nav-menu.tsx";
import { getPaginationDetailsFromQueryParams } from "../../utils/pagination.ts";
import { getBrowseFilterFromQueryParams } from "../../utils/browse-filters.ts";
import type { PaginatedList } from "../../models/pagination.ts";
import type { Domain } from "../../models/domain.ts";
import { InvalidInputError } from "../../errors/invalid-input.ts";

type Data = {
  paginatedList: PaginatedList<Domain>;
  url: URL;
};

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    try {
      const records = getPaginatedList(
        getPaginationDetailsFromQueryParams(url),
        getBrowseFilterFromQueryParams(url),
      );

      return ctx.render({
        paginatedList: records,
        url,
      });
    } catch (error: unknown) {
      console.error(error);

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

export default function Browse({ data }: PageProps<Data>) {
  return (
    <>
      <Header />
      <Heading />
      <Section>
        <NavBar />
        <h4>Browse</h4>
        <NavMenu url={data.url} />
        <DomainList list={data.paginatedList.list} />
        <PaginationPanel
          pagination={data.paginatedList.pagination}
          url={data.url}
        />
      </Section>
    </>
  );
}
