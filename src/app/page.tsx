import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PitchCard } from "@/components/pitches/pitch-card";
import { PhotoCarousel } from "@/components/pitches/photo-carousel";
import { appConfig } from "@/config/app";
import { theme } from "@/config/theme";
import { pitches } from "@/lib/mock/queries";

export default function HomePage() {
  const featured = pitches.slice(0, 3);
  const heroPhotos = pitches.flatMap((pitch) => pitch.photos).slice(0, 5);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)]">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.ivory} 0%, ${theme.colors.surfaceMuted} 48%, ${theme.colors.coralSoft} 100%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid min-h-[78vh] w-full max-w-[var(--content-max)] items-center gap-10 px-[var(--page-gutter)] py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-[36rem]">
            <p className="font-display text-[length:var(--type-h1)] font-semibold tracking-tight text-[var(--color-forest)]">
              {appConfig.name}
            </p>
            <h1 className="mt-3 font-display text-[length:var(--type-h2)] font-medium tracking-tight text-[var(--color-forest-fill)]">
              Terenuri de fotbal, rezervate fără haos.
            </h1>
            <p className="mt-4 max-w-[42ch] text-[var(--type-body)] opacity-90">
              Filtrezi, alegi ziua, alegi ora. Proprietarii își țin locurile
              disponibile din panou.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link href="/terenuri">Vezi terenurile</Link>
              </Button>
              <Button asChild variant="primary">
                <Link href="/rezervari/nou">Rezervă acum</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/preturi">Adaugă-ți terenurile</Link>
              </Button>
            </div>
          </div>
          <div className="shadow-[0_22px_48px_color-mix(in_srgb,var(--color-forest)_22%,transparent)]">
            <PhotoCarousel
              photos={heroPhotos}
              alt="Atmosferă terenuri Mingo"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-[length:var(--type-h2)] font-semibold tracking-tight text-[var(--color-forest)]">
            Aproape de tine
          </h2>
          <Button asChild variant="ghost">
            <Link href="/terenuri">Toate</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pitch) => (
            <PitchCard key={pitch.id} pitch={pitch} />
          ))}
        </div>
      </section>
    </div>
  );
}
