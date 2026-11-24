import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { PinGlyph, PriceGlyph } from "@/components/ui/meta-icons";
import { PhotoCarousel } from "@/components/pitches/photo-carousel";
import { PitchMap } from "@/components/pitches/pitch-map";
import { PitchBookingPanel } from "@/components/pitches/pitch-booking-panel";
import { pitchFeatureLabels } from "@/lib/mock/pitch-features";
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
  const features = pitchFeatureLabels(pitch, 5);
  const openBookings = bookingsForPitch(pitch.id).filter(
    (booking) => booking.status === "open" && openSeats(booking) > 0,
  );

  return (
    <PageShell title={pitch.name}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <PhotoCarousel photos={pitch.photos} alt={pitch.name} />
          <div className="space-y-3">
            {features.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full px-3 py-1 text-sm font-medium text-[var(--color-ivory)]"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-ivory) 12%, transparent)",
                      boxShadow:
                        "inset 0 0 0 1px color-mix(in srgb, var(--color-ivory) 18%, transparent)",
                    }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-col gap-2 text-[var(--color-ivory)] lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-2">
              <p className="flex items-start gap-2">
                <PinGlyph className="mt-0.5" />
                <span>
                  {pitch.oras}, {pitch.zona}
                  <span className="opacity-70"> · {pitch.judet}</span>
                </span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <PriceGlyph />
                <span>
                  {formatRon(pitch.pricePerHourRon)}
                  <span className="font-medium opacity-70"> / oră</span>
                </span>
              </p>
            </div>
          </div>
          <p className="max-w-[55ch] text-[var(--color-ivory)] opacity-85">
            {pitch.description}
          </p>
          <PitchMap lat={pitch.lat} lng={pitch.lng} name={pitch.name} />
        </div>
        <aside className="space-y-6">
          <section
            className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-4 sm:p-5"
            style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-forest)" }}
          >
            <PitchBookingPanel pitchId={pitch.id} availableDays={days} />
          </section>
          <section
            className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-4 sm:p-5"
            style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-forest)" }}
          >
            <h2 className="font-display text-[var(--type-h3)] font-semibold text-[var(--color-forest)]">
              Echipe incomplete
            </h2>
            {openBookings.length === 0 ? (
              <EmptyState
                tone="light"
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
