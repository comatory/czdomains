import { DB } from "sqlite";

export const db = new DB(Deno.realPathSync("sqlite.db"));
