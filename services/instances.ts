import { DB } from "sqlite";
import { DomainsRepository } from "./domains-repository.ts";

const db = new DB(Deno.realPathSync("sqlite.db"));

export const domainsRepository = new DomainsRepository({ db });
