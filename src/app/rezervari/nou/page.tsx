"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { upsertBooking } from "@/lib/mock/booking-store";
import { isValidRoPhone } from "@/lib/mock/phone";
import {
  bookingPriceRon,
  formatRon,
  getPitch,
  pitches,
} from "@/lib/mock/queries";
import {
  availableDays,
  formatDayLong,
  formatHour,
  freeHoursForDay,
} from "@/lib/mock/schedule";
import { theme } from "@/config/theme";

function NewBookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const lockedPitchId = params.get("pitchId");
  const initialPitch = lockedPitchId ?? pitches[0]?.id ?? "";
  const [pitchId, setPitchId] = useState(initialPitch);
  const [day, setDay] = useState("");
  const [slotId, setSlotId] = useState(params.get("slotId") ?? "");
  const [players, setPlayers] = useState(8);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const pitchLocked = Boolean(lockedPitchId && getPitch(lockedPitchId));
  const pitch = getPitch(pitchId);
  const days = useMemo(() => availableDays(pitchId), [pitchId]);
  const hours = useMemo(
    () => (day ? freeHoursForDay(pitchId, day) : []),
    [pitchId, day],
  );
  const total = pitch ? bookingPriceRon(pitch) : 0;

  const sameCityPitches = useMemo(() => {
    if (!pitch) return pitches;
    return pitches.filter((item) => item.oras === pitch.oras);
  }, [pitch]);

  useEffect(() => {
    if (slotId && hours.some((h) => h.id === slotId)) return;
    setSlotId("");
  }, [day, hours, slotId]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slotId) return;
    if (!isValidRoPhone(contactPhone)) {
      setPhoneError("Introdu un telefon valid (07…)");
      return;
    }
    const id = `b-${Date.now()}`;
    upsertBooking({
      id,
      pitchId,
      slotId,
      hostId: "u-player",
      playerIds: ["u-player"],
      status: "pending",
      seatsNeeded: players,
      contactName,
      contactEmail,
      contactPhone,
    });
    router.push(
      `/confirmare-rezervare?bookingId=${id}&email=${encodeURIComponent(contactEmail)}`,
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-[var(--content-max)] flex-col px-[var(--page-gutter)] py-8 sm:py-12"
    >
      <header className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="font-display text-[length:var(--type-h1)] font-semibold tracking-tight text-[var(--color-forest)]">
            Rezervă
          </h1>
          <p className="mt-2 max-w-[40ch] text-[var(--type-body)] text-[var(--color-forest-fill)]">
            Alege o zi liberă, apoi ora.
          </p>
        </div>

        <div className="w-full max-w-sm">
          {pitchLocked && pitch ? (
            <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-surface-muted)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-forest-fill)]">
                Teren ales
              </p>
              <p className="mt-1 font-semibold text-[var(--color-forest)]">
                {pitch.name}
              </p>
              <p className="text-sm text-[var(--color-forest-fill)]">
                {pitch.oras} · {pitch.zona}
              </p>
              <Link
                href="/terenuri"
                className="mt-3 inline-block text-sm font-semibold text-[var(--color-forest)] underline underline-offset-4"
              >
                Alege alt teren
              </Link>
            </div>
          ) : (
            <SelectField
              label="Teren în același oraș"
              name="pitchId"
              value={pitchId}
              options={sameCityPitches.map((item) => ({
                value: item.id,
                label: `${item.name} · ${item.zona}`,
              }))}
              onValueChange={(next) => {
                setPitchId(next);
                setDay("");
                setSlotId("");
              }}
            />
          )}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
        <section className="w-full">
          {days.length === 0 ? (
            <EmptyState
              title="Nicio zi liberă pe terenul ăsta"
              description="Proprietarul nu a deschis încă intervale. Alege alt teren sau revino mai târziu."
              action={
                <Button asChild variant="accent">
                  <Link href="/terenuri">Vezi alte terenuri</Link>
                </Button>
              }
            />
          ) : (
            <BookingCalendar
              availableDays={days}
              selectedDay={day}
              onSelectDay={(value) => {
                setDay(value);
                setSlotId("");
              }}
            />
          )}
        </section>

        <section className="w-full lg:pt-2" aria-live="polite">
          {!day ? (
            <EmptyState
              title="Alege o zi"
              description="Zilele libere apar evidențiate în calendar. Cele inactive nu au ore."
            />
          ) : (
            <>
              <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--color-forest)] sm:text-2xl">
                {formatDayLong(day)}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-forest-fill)]">
                Ore libere
              </p>
              {hours.length === 0 ? (
                <EmptyState
                  className="mt-6"
                  title="Nicio oră liberă"
                  description="Ziua e în calendar, dar toate orele sunt ocupate. Încearcă altă dată."
                />
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  {hours.map((slot) => {
                    const active = slot.id === slotId;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSlotId(slot.id)}
                        className="min-w-[5.5rem] rounded-[var(--radius-sm)] px-5 py-3 text-base font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                        style={{
                          backgroundColor: active
                            ? theme.colors.coral
                            : theme.colors.surfaceMuted,
                          color: theme.colors.forest,
                        }}
                      >
                        {formatHour(slot.startsAt)}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <div className="mt-10 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] pt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nume"
                name="contactName"
                autoComplete="name"
                required
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
              <Input
                label="Email"
                name="contactEmail"
                type="email"
                autoComplete="email"
                required
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
              <Input
                label="Telefon"
                name="contactPhone"
                type="tel"
                autoComplete="tel"
                required
                value={contactPhone}
                error={phoneError}
                onChange={(event) => {
                  setContactPhone(event.target.value);
                  setPhoneError("");
                }}
              />
            </div>
            <div className="flex flex-wrap items-end gap-8">
              <div className="w-28">
                <Input
                  label="Jucători"
                  name="players"
                  type="number"
                  min={1}
                  max={pitch?.capacity ?? 14}
                  value={players}
                  onChange={(event) =>
                    setPlayers(Number(event.target.value) || 1)
                  }
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-forest-fill)]">
                  Total
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-forest)]">
                  {formatRon(total)}
                  <span className="ml-2 text-sm font-sans font-medium text-[var(--color-forest-fill)]">
                    / oră
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ghost">
                <Link href={pitch ? `/terenuri/${pitch.id}` : "/terenuri"}>
                  Înapoi
                </Link>
              </Button>
              <Button type="submit" variant="accent" disabled={!slotId}>
                Confirmă
              </Button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}

export default function RezervareNouaPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-14">
          <Skeleton label="Se încarcă rezervarea" lines={6} />
        </div>
      }
    >
      <NewBookingForm />
    </Suspense>
  );
}
