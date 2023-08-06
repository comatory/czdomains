function isCountInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

export function normalizePageCount(maybeCount: unknown, size: number): number {
  const count = isCountInteger(maybeCount) ? maybeCount : 0;

  return Math.ceil(count / size) - 1;
}
