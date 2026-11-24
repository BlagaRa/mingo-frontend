import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { theme } from "@/config/theme";

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-sm)] ${className}`}
      style={{ backgroundColor: theme.colors.surfaceMuted }}
    />
  );
}

function IvoryCard({ children }: { children: ReactNode }) {
  return (
    <section
      className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-4 sm:p-5"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      {children}
    </section>
  );
}

export default function PitchDetailLoading() {
  return (
    <PageShell title="Se încarcă terenul" description="Pregătim detaliile.">
      <div
        role="status"
        aria-label="Se încarcă detaliile terenului"
        aria-busy="true"
        className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <span className="sr-only">Se încarcă detaliile terenului</span>
        <div className="space-y-6">
          <Pulse className="aspect-[16/10] w-full rounded-[var(--radius-md)]" />
          <div className="space-y-3">
            <Pulse className="h-3 w-[92%]" />
            <Pulse className="h-3 w-[78%]" />
            <Pulse className="h-3 w-[64%]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Pulse className="h-8 w-36 rounded-full" />
            <Pulse className="h-8 w-24 rounded-full" />
          </div>
          <Pulse className="h-48 w-full rounded-[var(--radius-md)]" />
        </div>
        <aside className="space-y-6">
          <IvoryCard>
            <div
              className="mb-4 h-5 w-28 animate-pulse rounded-[var(--radius-sm)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-forest) 14%, transparent)",
              }}
            />
            <div
              className="mb-3 h-4 w-40 animate-pulse rounded-[var(--radius-sm)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-forest) 12%, transparent)",
              }}
            />
            <div className="grid grid-cols-7 gap-1 py-2">
              {Array.from({ length: 7 }, (_, index) => (
                <div
                  key={index}
                  className="mx-auto h-10 w-10 animate-pulse rounded-full sm:h-11 sm:w-11"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-forest-fill) 22%, transparent)",
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div
                className="h-9 w-16 animate-pulse rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-forest) 12%, transparent)",
                }}
              />
              <div
                className="h-9 w-16 animate-pulse rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-forest) 12%, transparent)",
                }}
              />
            </div>
          </IvoryCard>
          <IvoryCard>
            <div
              className="mb-3 h-5 w-40 animate-pulse rounded-[var(--radius-sm)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-forest) 14%, transparent)",
              }}
            />
            <div
              className="rounded-[var(--radius-md)] px-5 py-8"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-forest-fill) 10%, var(--color-ivory))",
                boxShadow:
                  "inset 0 0 0 1px color-mix(in srgb, var(--color-forest-fill) 18%, transparent)",
              }}
            >
              <div
                className="mx-auto h-5 w-48 animate-pulse rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-forest) 16%, transparent)",
                }}
              />
              <div
                className="mx-auto mt-3 h-3 w-56 animate-pulse rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-forest) 10%, transparent)",
                }}
              />
            </div>
          </IvoryCard>
        </aside>
      </div>
    </PageShell>
  );
}
