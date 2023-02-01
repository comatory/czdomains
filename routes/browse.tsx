import { Handlers, PageProps } from "$fresh/server.ts";

import Header from "../components/header.tsx";
import Heading from "../components/heading.tsx";
import NavBar from "../components/nav-bar.tsx";
import Section from "../components/section.tsx";

import { domainsRepository } from "../services/instances.ts";
import type { PaginatedList } from "../models/pagination.ts";
import type { Domain } from "../models/domain.ts";

export const handler: Handlers<PaginatedList<Domain>> = {
  GET(req, ctx) {
    const params = new URLSearchParams(new URL(req.url).searchParams);
    const records = domainsRepository.getPaginatedList({
      offset: Number(params.get("offset")),
      limit: Number(params.get("limit")),
    });

    return ctx.render(records);
  },
};

export default function Browse({ data }: PageProps<PaginatedList<Domain>>) {
  return (
    <>
      <Header />
      <Heading />
      <Section>
        <NavBar />
        <h4>Browse</h4>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>URL</td>
              <td>date</td>
            </tr>
          </thead>
          {data.list.map(({ id, value, createdAt }) => (
            <tr>
              <td>{id}</td>
              <td>{value}</td>
              <td>{createdAt}</td>
            </tr>
          ))}
        </table>
      </Section>
    </>
  );
}
