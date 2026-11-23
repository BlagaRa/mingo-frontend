import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { PhotoCarousel } from "@/components/pitches/photo-carousel";
import { PitchMap } from "@/components/pitches/pitch-map";
import { PitchWeekHours } from "@/components/pitches/pitch-week-hours";
import {
  bookingsForPitch,
  formatRon,
  getPitch,
  getSlot,
  openSeats,
} from "@/lib/mock/queries";
import { availableDays } from "@/lib/mock/schedule";
import { formatDateTime } from "@/lib/mock/queries";

export default async function PitchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pitch = getPitch(id);
  if (!pitch) notFound();

  const days = availableDays(pitch.id);
  const openBookings = bookingsForPitch(pitch.id).filter(
    (booking) => booking.status === "open" && openSeats(booking) > 0,
  );

  return (
    <PageShell
      title={pitch.name}
      description={`${pitch.oras} · ${pitch.zona}`}
      actions={
        <Button asChild variant="accent">
          <Link href={`/rezervari/nou?pitchId=${pitch.id}`}>Rezervă acum</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <PhotoCarousel photos={pitch.photos} alt={pitch.name} />
          <p className="max-w-[55ch]">{pitch.description}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-[var(--color-coral-soft)] px-3 py-1 font-medium">
              {formatRon(pitch.pricePerHourRon)} / oră · tot terenul
            </span>
            {pitch.covered ? (
              <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1">
                Acoperit
              </span>
            ) : null}
            {pitch.nightLights ? (
              <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1">
                Nocturnă
              </span>
            ) : null}
          </div>
          <PitchMap lat={pitch.lat} lng={pitch.lng} name={pitch.name} />
        </div>
        <aside className="space-y-6">
          <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-4">
            <h2 className="font-display text-[var(--type-h3)] font-semibold">
              Ore pe săptămână
            </h2>
            <div className="mt-4">
              <PitchWeekHours pitchId={pitch.id} availableDays={days} />
            </div>
            <Button asChild variant="accent" className="mt-5 w-full">
              <Link href={`/rezervari/nou?pitchId=${pitch.id}`}>
                Rezervă acum
              </Link>
            </Button>
          </section>
          <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-4">
            <h2 className="font-display text-[var(--type-h3)] font-semibold">
              Echipe incomplete
            </h2>
            {openBookings.length === 0 ? (
              <EmptyState
                className="mt-3"
                title="Nicio echipă deschisă"
                description="Când cineva rezervă și lasă locuri libere, apar aici."
              />
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {openBookings.map((booking) => {
                  const slot = getSlot(booking.slotId);
                  return (
                    <li
                      key={booking.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span>
                        {slot ? formatDateTime(slot.startsAt) : booking.id}
                        <span className="opacity-70">
                          {" "}
                          · {openSeats(booking)} locuri
                        </span>
                      </span>
                      <Button asChild variant="primary">
                        <Link href={`/rezervari/${booking.id}`}>Intră</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
