import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PitchCard } from "@/components/pitches/pitch-card";
import { appConfig } from "@/config/app";
import { pitches } from "@/lib/mock/queries";

function IconCancel() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconSchedule() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 3.5v3M16 3.5v3M4 9.5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 17.5c.6-2.2 2.4-3.5 4.5-3.5s3.9 1.3 4.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.5 17.5c.4-1.5 1.5-2.5 3-2.5 1.3 0 2.3.8 2.8 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const trustPoints: { icon: ReactNode; label: string }[] = [
  { icon: <IconCancel />, label: "Poți anula oricând" },
  { icon: <IconSchedule />, label: "Programul, direct din aplicație" },
  { icon: <IconPeople />, label: "Alătură-te celorlalți" },
];

export default function HomePage() {
  const featured = pitches.slice(0, 3);

  return (
    <div>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          {/* Pre-cropped 4K JPEG — full bleed, no CSS offset gaps */}
          <img
            src="/hero/adidas-coral.jpg?v=4k"
            alt=""
            width={3840}
            height={2160}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(100deg, color-mix(in srgb, var(--color-forest) 55%, transparent) 0%, color-mix(in srgb, var(--color-forest) 28%, transparent) 34%, transparent 58%)",
                "linear-gradient(180deg, color-mix(in srgb, var(--color-forest) 22%, transparent) 0%, transparent 20%, transparent 82%, color-mix(in srgb, var(--color-forest) 30%, transparent) 100%)",
              ].join(", "),
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[var(--content-max)] items-center px-[var(--page-gutter)] py-28 lg:pl-[clamp(2rem,8vw,7rem)]">
          <div className="w-full max-w-[44rem]">
            <p className="mingo-rise font-display text-[clamp(4.2rem,10vw,7.25rem)] font-semibold leading-[0.88] tracking-[-0.03em] text-[var(--color-ivory)]">
              {appConfig.name}
            </p>
            <h1 className="mingo-rise mingo-rise-delay-1 mt-6 max-w-[18ch] font-display text-[clamp(1.85rem,4vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--color-ivory)]">
              Terenuri de fotbal, rezervate{" "}
              <span className="text-[var(--color-coral)]">fără haos</span>.
            </h1>
            <div className="mingo-rise mingo-rise-delay-2 mt-10 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link href="/rezervari/nou">Rezervă acum</Link>
              </Button>
              <Button asChild variant="soft">
                <Link href="/preturi">Adaugă-ți terenurile</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="De ce Mingo"
        className="border-y border-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] bg-[var(--color-ivory)]"
      >
        <ul className="mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-4 px-[var(--page-gutter)] py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-8">
          {trustPoints.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 text-[color-mix(in_srgb,var(--color-forest)_72%,transparent)]"
            >
              <span className="shrink-0 opacity-70">{item.icon}</span>
              <span className="text-[0.8rem] font-medium tracking-[0.01em]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-16 sm:py-20">
        <h2 className="mb-10 font-display text-[length:var(--type-h2)] font-semibold tracking-tight text-[var(--color-ivory)]">
          Aproape de <span className="text-[var(--color-coral)]">tine</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pitch) => (
            <PitchCard key={pitch.id} pitch={pitch} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="soft">
            <Link href="/terenuri">Vezi toate terenurile</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
