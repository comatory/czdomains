import { PaginatedRecord } from "./pagination.ts";

export type Domain = {
  id: number;
  value: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type RawDomain = [
  number,
  string,
  Date,
  Date | null,
];

export function normalizeDomainFromDB(
  record: RawDomain | PaginatedRecord<RawDomain>,
): Domain {
  return {
    id: record[0],
    value: record[1],
    createdAt: record[2],
    updatedAt: record[3],
  };
}
