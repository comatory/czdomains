export const BROWSE_FILTERS = {
  all: "all",
  numbers: "numbers",
  a_e: "a_e",
  f_j: "f_j",
  k_o: "k_o",
  p_t: "p_t",
  u_z: "u_z",
} as const;

export type BrowseFilter = typeof BROWSE_FILTERS[keyof typeof BROWSE_FILTERS];

type FilterMembers = { start: string; end: string };

export const FILTER_MEMBERS: Record<BrowseFilter, FilterMembers> = {
  all: { start: "", end: "" },
  numbers: { start: "0", end: "9" },
  a_e: { start: "a", end: "e" },
  f_j: { start: "f", end: "j" },
  k_o: { start: "k", end: "o" },
  p_t: { start: "p", end: "t" },
  u_z: { start: "u", end: "z" },
} as const;
