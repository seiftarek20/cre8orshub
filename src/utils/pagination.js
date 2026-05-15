export const DEFAULT_PAGE_SIZE = 12;

export function getPaginationRange(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safePageSize = Math.max(Number(pageSize) || DEFAULT_PAGE_SIZE, 1);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  return {
    page: safePage,
    pageSize: safePageSize,
    from,
    to,
  };
}

export function buildPaginatedResult(data, count, page, pageSize, normalizer = (item) => item) {
  const items = (data || []).map(normalizer);
  const total = Number(count || 0);

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}
