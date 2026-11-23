"use client";

import { useMemo, useState } from "react";
import { BarChart } from "@/components/crm/bar-chart";
import { TrendChart } from "@/components/crm/trend-chart";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { theme } from "@/config/theme";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import {
  DEMO_STATS_TODAY,
  ownerStatsReport,
  type StatsPeriod,
} from "@/lib/mock/owner-stats";
import { ownerPitches } from "@/lib/mock/queries";

const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: "today", label: "Azi" },
  { value: "week", label: "Săptămâna asta" },
  { value: "month", label: "Luna asta" },
  { value: "custom", label: "Calendar" },
];

export default function OwnerStatsPage() {
  const mine = ownerPitches(DEMO_OWNER_ID);
  const [pitchId, setPitchId] = useState("");
  const [period, setPeriod] = useState<StatsPeriod>("month");
  const [fromDay, setFromDay] = useState(DEMO_STATS_TODAY);
  const [toDay, setToDay] = useState(DEMO_STATS_TODAY);

  const report = useMemo(
    () =>
      ownerStatsReport(
        DEMO_OWNER_ID,
        pitchId,
        period,
        period === "custom" ? { from: fromDay, to: toDay } : undefined,
      ),
    [pitchId, period, fromDay, toDay],
  );

  return (
    <PageShell
      title="Statistici"
      description="Raport pe teren și perioadă — ce s-a rezervat, încasat și anulat."
    >
      <div className="mb-8 flex flex-col gap-4">
        <div className="max-w-xs">
          <SelectField
            label="Teren"
            size="sm"
            value={pitchId}
            emptyLabel="Toate terenurile"
            options={mine.map((pitch) => ({
              value: pitch.id,
              label: pitch.name,
            }))}
            onValueChange={setPitchId}
          />
        </div>

        <div role="group" aria-label="Perioadă">
          <p className="mb-2 text-sm opacity-70">Perioadă</p>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const active = period === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(option.value)}
                  className="rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-semibold transition-[transform,background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                  style={{
                    backgroundColor: active
                      ? theme.colors.coral
                      : "transparent",
                    color: active ? theme.colors.onCoral : theme.colors.ivory,
                    boxShadow: active
                      ? "none"
                      : "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 16%, transparent)",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {period === "custom" ? (
          <div className="flex flex-wrap items-end gap-3">
            <Input
              label="De la"
              type="date"
              name="statsFrom"
              value={fromDay}
              onChange={(event) => setFromDay(event.target.value)}
            />
            <Input
              label="Până la"
              type="date"
              name="statsTo"
              value={toDay}
              min={fromDay}
              onChange={(event) => {
                const next = event.target.value;
                setToDay(next < fromDay ? fromDay : next);
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-4 border-b border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] pb-6 sm:flex sm:flex-wrap sm:gap-8">
        <div>
          <p className="text-sm opacity-70">Rezervări</p>
          <p
            data-testid="stat-total"
            className="mt-1 font-display text-2xl font-semibold tabular-nums text-[var(--color-ivory)] sm:text-3xl"
          >
            {report.total}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70">Încasate</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-[var(--color-ivory)] sm:text-3xl">
            {report.confirmed}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70">Anulate</p>
          <p
            className="mt-1 font-display text-2xl font-semibold tabular-nums sm:text-3xl"
            style={{ color: theme.colors.ivory }}
          >
            {report.cancelled}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] p-5">
          <BarChart
            title="Rezervări pe teren"
            data={report.byPitch.map(({ pitch, count }) => ({
              label: pitch.name,
              value: count,
            }))}
          />
        </section>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] p-5">
          <TrendChart title={report.seriesTitle} data={report.series} />
        </section>
      </div>
    </PageShell>
  );
}
