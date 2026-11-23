export const CRM_PAGE_SIZE = 5;

export type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function paginate<T>(
  items: T[],
  pageParam: string | undefined,
  pageSize: number = CRM_PAGE_SIZE,
): PageResult<T> {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const requested = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;
  const safePage =
    totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}
