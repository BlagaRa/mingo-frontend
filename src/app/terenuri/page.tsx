import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PitchCard } from "@/components/pitches/pitch-card";
import { PitchFilters } from "@/components/pitches/pitch-filters";
import { PitchPagination } from "@/components/pitches/pitch-pagination";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { queryPitchesPage } from "@/lib/mock/queries";

type Search = {
  judet?: string;
  oras?: string;
  zona?: string;
  q?: string;
  surface?: string;
  covered?: string;
  nightLights?: string;
  indoor?: string;
  minCapacity?: string;
  page?: string;
};

export default async function TerenuriPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const result = queryPitchesPage(filters);
  const filterEntries = Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== "page"),
  );
  const hasActiveFilters = Object.values(filterEntries).some(Boolean);

  return (
    <PageShell title="Terenuri" description="Găsește terenul, rezervă ora.">
      <Suspense
        fallback={
          <div className="mb-8">
            <Skeleton label="Se încarcă filtrele" lines={4} />
          </div>
        }
      >
        <PitchFilters />
      </Suspense>

      {result.total === 0 ? (
        <EmptyState
          className="mt-8"
          title={
            hasActiveFilters
              ? "Niciun teren pe filtrele astea"
              : "Încă nu avem terenuri aici"
          }
          description={
            hasActiveFilters
              ? "Lărgește județul, șterge un filtru sau caută alt nume."
              : "Revino în curând sau schimbă zona din filtre."
          }
          action={
            hasActiveFilters ? (
              <Button asChild variant="accent">
                <Link href="/terenuri">Resetează filtrele</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="mt-6 text-sm text-[var(--color-coral)]">
            {result.total} terenuri · pagina {result.page} din {result.totalPages}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((pitch) => (
              <PitchCard key={pitch.id} pitch={pitch} />
            ))}
          </div>
          <PitchPagination
            page={result.page}
            totalPages={result.totalPages}
            filters={filters}
          />
        </>
      )}
    </PageShell>
  );
}
