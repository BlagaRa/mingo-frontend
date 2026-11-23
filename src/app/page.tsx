import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PitchCard } from "@/components/pitches/pitch-card";
import { appConfig } from "@/config/app";
import { pitches } from "@/lib/mock/queries";

export default function HomePage() {
  const featured = pitches.slice(0, 3);
  const heroPhoto =
    pitches.flatMap((pitch) => pitch.photos)[0] ??
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1800&q=80";

  return (
    <div>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroPhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover mingo-hero-pan"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(185deg, color-mix(in srgb, var(--color-forest) 68%, transparent) 0%, color-mix(in srgb, var(--color-forest) 62%, transparent) 34%, color-mix(in srgb, var(--color-forest) 88%, transparent) 62%, var(--color-forest) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[var(--content-max)] flex-col justify-end px-[var(--page-gutter)] pb-16 pt-28 sm:pb-20">
          <p
            className="mingo-rise font-display text-[clamp(3.4rem,9vw,6.4rem)] font-semibold leading-[0.92] tracking-tight text-[var(--color-ivory)]"
            style={{
              textShadow:
                "0 10px 40px color-mix(in srgb, var(--color-forest) 70%, transparent)",
            }}
          >
            {appConfig.name}
          </p>
          <h1
            className="mingo-rise mingo-rise-delay-1 mt-5 max-w-[16ch] font-display text-[clamp(1.55rem,3.4vw,2.35rem)] font-medium tracking-tight text-[var(--color-ivory)]"
            style={{
              textShadow:
                "0 8px 28px color-mix(in srgb, var(--color-forest) 75%, transparent)",
            }}
          >
            Terenuri de fotbal, rezervate{" "}
            <span className="text-[var(--color-coral)]">fără haos</span>.
          </h1>
          <p className="mingo-rise mingo-rise-delay-2 mt-4 max-w-[38ch] text-[var(--type-body)] text-[var(--color-ivory)]">
            Filtrezi, alegi ziua, alegi ora. Proprietarii își țin locurile
            disponibile din panou.
          </p>
          <div className="mingo-rise mingo-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent">
              <Link href="/rezervari/nou">Rezervă acum</Link>
            </Button>
            <Button asChild variant="soft">
              <Link href="/preturi">Adaugă-ți terenurile</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-[length:var(--type-h2)] font-semibold tracking-tight text-[var(--color-ivory)]">
            Aproape de <span className="text-[var(--color-coral)]">tine</span>
          </h2>
          <Button asChild variant="soft">
            <Link href="/terenuri">Vezi toate terenurile</Link>
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
