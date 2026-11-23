"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { ownerPitches } from "@/lib/mock/queries";
import {
  OWNER_HOURS,
  availableDays,
  formatDayLabel,
  hourKey,
} from "@/lib/mock/schedule";
import { theme } from "@/config/theme";

export default function OwnerAvailabilityPage() {
  const mine = ownerPitches("u-owner");
  const [scope, setScope] = useState<string>("all");
  const [day, setDay] = useState("2026-11-24");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const days = useMemo(() => {
    const fromSlots = mine.flatMap((pitch) => availableDays(pitch.id));
    const unique = [...new Set(fromSlots)];
    if (unique.length === 0) return ["2026-11-24", "2026-11-25", "2026-11-26"];
    return unique.sort();
  }, [mine]);

  const targets =
    scope === "all" ? mine.map((p) => p.id) : mine.filter((p) => p.id === scope).map((p) => p.id);

  function isOn(hour: string) {
    return targets.every((pitchId) => open[hourKey(pitchId, day, hour)] !== false);
  }

  function toggleHour(hour: string) {
    const nextOn = !isOn(hour);
    setOpen((current) => {
      const copy = { ...current };
      for (const pitchId of targets) {
        copy[hourKey(pitchId, day, hour)] = nextOn;
      }
      return copy;
    });
  }

  function setAll(on: boolean) {
    setOpen((current) => {
      const copy = { ...current };
      for (const pitchId of targets) {
        for (const hour of OWNER_HOURS) {
          copy[hourKey(pitchId, day, hour)] = on;
        }
      }
      return copy;
    });
  }

  if (mine.length === 0) {
    return (
      <PageShell
        title="Disponibilitate"
        description="Pune ore libere pe un teren sau pe toate odată."
      >
        <EmptyState
          title="Adaugă un teren întâi"
          description="Fără terenuri nu poți deschide ore. Creează unul, apoi revino aici."
          action={
            <Button asChild variant="accent">
              <Link href="/proprietar/terenuri/nou">Teren nou</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Disponibilitate"
      description="Pune ore libere pe un teren sau pe toate odată."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={scope === "all" ? "primary" : "ghost"}
          onClick={() => setScope("all")}
        >
          Toate terenurile
        </Button>
        {mine.map((pitch) => (
          <Button
            key={pitch.id}
            variant={scope === pitch.id ? "accent" : "ghost"}
            onClick={() => setScope(pitch.id)}
          >
            {pitch.name}
          </Button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {days.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDay(value)}
            className="rounded-[var(--radius-sm)] border px-3 py-2 text-sm font-semibold active:scale-[0.97]"
            style={{
              backgroundColor:
                value === day ? theme.colors.forestFill : theme.colors.ivory,
              color: value === day ? theme.colors.ivory : theme.colors.forest,
              borderColor:
                value === day
                  ? theme.colors.forestFill
                  : "color-mix(in srgb, #073035 14%, transparent)",
            }}
          >
            {formatDayLabel(value)}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="accent" onClick={() => setAll(true)}>
          Deschide toată ziua
        </Button>
        <Button variant="ghost" onClick={() => setAll(false)}>
          Închide toată ziua
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {OWNER_HOURS.map((hour) => {
          const on = isOn(hour);
          return (
            <button
              key={hour}
              type="button"
              onClick={() => toggleHour(hour)}
              className="rounded-[var(--radius-sm)] border px-3 py-4 text-sm font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
              style={{
                backgroundColor: on ? theme.colors.coral : theme.colors.surfaceMuted,
                color: theme.colors.forest,
                borderColor: on
                  ? theme.colors.coral
                  : "color-mix(in srgb, #073035 12%, transparent)",
              }}
            >
              {hour}
              <span className="mt-1 block text-[0.7rem] font-medium opacity-80">
                {on ? "liber" : "închis"}
              </span>
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
