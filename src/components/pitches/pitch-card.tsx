"use client";

import Link from "next/link";
import type { Pitch } from "@/lib/mock/types";
import { formatRon } from "@/lib/mock/queries";
import { theme } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { PhotoCarousel } from "@/components/pitches/photo-carousel";

export function PitchCard({ pitch }: { pitch: Pitch }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-ivory)] shadow-[0_10px_24px_color-mix(in_srgb,var(--color-forest)_10%,transparent)] transition-[transform,box-shadow] duration-[var(--motion-hover-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_14px_28px_color-mix(in_srgb,var(--color-forest)_14%,transparent)]">
      <Link
        href={`/terenuri/${pitch.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Detalii ${pitch.name}`}
      />
      <div className="relative">
        <PhotoCarousel photos={pitch.photos} alt={pitch.name} />
        <span
          className="pointer-events-none absolute left-3 top-3 z-20 rounded-[var(--radius-sm)] px-2 py-1 text-[0.7rem] font-semibold"
          style={{
            backgroundColor: theme.colors.ivory,
            color: theme.colors.forest,
          }}
        >
          {pitch.surface}
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col gap-3 p-4 pointer-events-none">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--color-forest)]">
            {pitch.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-forest)] opacity-70">
            {pitch.oras} · {pitch.zona}
          </p>
        </div>
        <p className="text-sm font-semibold text-[var(--color-forest)]">
          {formatRon(pitch.pricePerHourRon)}
          <span className="font-medium opacity-70"> / oră</span>
        </p>
        <div className="mt-auto pointer-events-auto">
          <Button asChild variant="accent" className="w-full">
            <Link href={`/rezervari/nou?pitchId=${pitch.id}`}>Rezervă acum</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
