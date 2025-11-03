// src/utils/pagination.ts
export function getPagination(total: number, perPage: number) {
  const pages = Math.ceil(total / perPage);
  return Array.from({ length: pages }, (_, i) => i + 1);
}
