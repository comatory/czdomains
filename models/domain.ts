import { PaginatedRecord } from "./pagination.ts";

export type Domain = {
  id: number;
  value: string;
  updatedAt: Date | null;
};

export type RawDomain = {
  id: number;
  value: string;
  updated_at: Date | null;
};

export function normalizeDomainFromDB(
  record: RawDomain | PaginatedRecord<RawDomain>,
): Domain {
  return {
    id: record.id,
    value: record.value,
    updatedAt: record.updated_at ?? null,
  };
}
