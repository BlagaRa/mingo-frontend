import Link from "next/link";
import { CrmPagination } from "@/components/crm/crm-pagination";
import { CrmToolbar } from "@/components/crm/crm-toolbar";
import { DataTable } from "@/components/crm/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { filterAdminPitches } from "@/lib/mock/crm-queries";
import { paginate } from "@/lib/mock/paginate";
import { formatRon, ownerPitches } from "@/lib/mock/queries";

type Search = { q?: string; page?: string };

export default async function ProprietarTerenuriPage({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  const filters = (await searchParams) ?? {};
  const mine = ownerPitches(DEMO_OWNER_ID);
  const filtered = filterAdminPitches(mine, { q: filters.q });
  const result = paginate(filtered, filters.page);

  return (
    <PageShell
      title="Terenurile mele"
      description="Poze, locație și prețuri pe fiecare teren."
      actions={
        <Button asChild variant="accent">
          <Link href="/proprietar/terenuri/nou">Teren nou</Link>
        </Button>
      }
    >
      {mine.length === 0 ? (
        <EmptyState
          title="Niciun teren încă"
          description="Adaugă primul teren ca să deschizi ore și să primești rezervări."
          action={
            <Button asChild variant="accent">
              <Link href="/proprietar/terenuri/nou">Adaugă teren</Link>
            </Button>
          }
        />
      ) : (
        <>
          <CrmToolbar
            resultCount={result.total}
            searchDefault={filters.q ?? ""}
            action="/proprietar/terenuri"
          />
          <DataTable
            columns={["Teren", "Locație", "Preț", "Capacitate", ""]}
            empty={
              <EmptyState
                title="Niciun teren pe filtrele astea"
                description="Încearcă alt termen de căutare."
              />
            }
          >
            {result.items.length === 0
              ? null
              : result.items.map((pitch) => (
                  <tr
                    key={pitch.id}
                    className="border-t border-[color-mix(in_srgb,var(--color-forest)_10%,transparent)]"
                  >
                    <td className="px-4 py-3 font-medium">{pitch.name}</td>
                    <td className="px-4 py-3">
                      {pitch.oras} · {pitch.zona}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatRon(pitch.pricePerHourRon)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{pitch.capacity}</td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost">
                        <Link href={`/proprietar/terenuri/${pitch.id}`}>
                          Editează
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
          </DataTable>
          <CrmPagination
            basePath="/proprietar/terenuri"
            page={result.page}
            totalPages={result.totalPages}
            filters={{ q: filters.q }}
          />
        </>
      )}
    </PageShell>
  );
}
