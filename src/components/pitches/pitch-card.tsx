"use client";

import Link from "next/link";
import type { Pitch } from "@/lib/mock/types";
import { formatRon } from "@/lib/mock/queries";
import { theme } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { PhotoCarousel } from "@/components/pitches/photo-carousel";

export function PitchCard({ pitch }: { pitch: Pitch }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] bg-[var(--color-surface-muted)] shadow-[0_10px_24px_color-mix(in_srgb,var(--color-ivory)_8%,transparent)] transition-[transform,box-shadow] duration-[var(--motion-hover-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_14px_28px_color-mix(in_srgb,var(--color-ivory)_12%,transparent)]">
      <div className="relative">
        <PhotoCarousel photos={pitch.photos} alt={pitch.name} />
        <span
          className="pointer-events-none absolute left-3 top-3 z-20 rounded-[var(--radius-sm)] px-2 py-1 text-[0.7rem] font-semibold"
          style={{
            backgroundColor: theme.colors.coral,
            color: theme.colors.forest,
          }}
        >
          {pitch.surface}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--color-ivory)]">
            <Link href={`/terenuri/${pitch.id}`}>{pitch.name}</Link>
          </h2>
          <p className="mt-1 text-sm text-[var(--color-coral)]">
            {pitch.oras} · {pitch.zona}
          </p>
        </div>
        <p className="text-sm font-semibold text-[var(--color-ivory)]">
          {formatRon(pitch.pricePerHourRon)}
          <span className="font-medium opacity-70"> / oră</span>
        </p>
        <div className="mt-auto flex gap-2">
          <Button asChild variant="accent" className="flex-1">
            <Link href={`/rezervari/nou?pitchId=${pitch.id}`}>Rezervă acum</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/terenuri/${pitch.id}`}>Detalii</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
