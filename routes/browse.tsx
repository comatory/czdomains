import { Handlers, PageProps } from "$fresh/server.ts";

import Header from "../components/header.tsx";
import Heading from "../components/heading.tsx";
import NavBar from "../components/nav-bar.tsx";
import Section from "../components/section.tsx";

import { domainsRepository } from "../services/instances.ts";
import DomainList from "../components/domain-list.tsx";
import PaginationPanel from "../components/pagination/pagination-panel.tsx";
import { getPaginationDetailsFromQueryParams } from "../utils/pagination.ts";
import type { PaginatedList } from "../models/pagination.ts";
import type { Domain } from "../models/domain.ts";

type Data = {
  paginatedList: PaginatedList<Domain>;
  url: string;
};

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const records = domainsRepository.getPaginatedList(
      getPaginationDetailsFromQueryParams(new URL(req.url)),
    );

    return ctx.render({
      paginatedList: records,
      url: req.url,
    });
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
        <DomainList list={data.paginatedList.list} />
        <PaginationPanel
          pagination={data.paginatedList.pagination}
          root={data.url}
        />
      </Section>
    </>
  );
}
