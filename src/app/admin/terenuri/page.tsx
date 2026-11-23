import Link from "next/link";
import { CrmPagination } from "@/components/crm/crm-pagination";
import { CrmToolbar } from "@/components/crm/crm-toolbar";
import { DataTable } from "@/components/crm/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/feedback";
import { filterAdminPitches } from "@/lib/mock/crm-queries";
import { paginate } from "@/lib/mock/paginate";
import { formatRon, getUser, pitches } from "@/lib/mock/queries";

type Search = { q?: string; page?: string };

export default async function AdminTerenuriPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const filtered = filterAdminPitches(pitches, { q: filters.q });
  const result = paginate(filtered, filters.page);

  return (
    <PageShell
      title="Terenuri"
      description="Toate terenurile din platformă — căutare și paginare."
    >
      <CrmToolbar
        resultCount={result.total}
        searchDefault={filters.q ?? ""}
        action="/admin/terenuri"
      />

      <DataTable
        columns={["Teren", "Locație", "Proprietar", "Preț", "Capacitate"]}
        empty={
          <EmptyState
            title="Niciun teren pe filtrele astea"
            description="Încearcă alt termen de căutare."
          />
        }
      >
        {result.items.length === 0
          ? null
          : result.items.map((pitch) => {
              const owner = getUser(pitch.ownerId);
              return (
                <tr
                  key={pitch.id}
                  className="border-t border-[color-mix(in_srgb,var(--color-forest)_10%,transparent)]"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/terenuri/${pitch.id}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {pitch.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {pitch.oras}, {pitch.zona}
                  </td>
                  <td className="px-4 py-3">{owner?.name ?? pitch.ownerId}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatRon(pitch.pricePerHourRon)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{pitch.capacity}</td>
                </tr>
              );
            })}
      </DataTable>

      <CrmPagination
        basePath="/admin/terenuri"
        page={result.page}
        totalPages={result.totalPages}
        filters={{ q: filters.q }}
      />
    </PageShell>
  );
}
