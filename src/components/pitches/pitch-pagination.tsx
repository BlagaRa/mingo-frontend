import { CrmPagination } from "@/components/crm/crm-pagination";

export function PitchPagination({
  page,
  totalPages,
  filters,
}: {
  page: number;
  totalPages: number;
  filters: Record<string, string | undefined>;
}) {
  return (
    <CrmPagination
      basePath="/terenuri"
      page={page}
      totalPages={totalPages}
      filters={filters}
      ariaLabel="Paginare terenuri"
    />
  );
}
