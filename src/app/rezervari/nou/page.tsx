"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { freeBookableHoursForDay, upsertBooking } from "@/lib/mock/booking-store";
import { isValidRoPhone } from "@/lib/mock/phone";
import {
  bookingPriceRon,
  formatRon,
  getPitch,
  getSlot,
  pitches,
} from "@/lib/mock/queries";
import {
  availableDays,
  formatDayLong,
  formatHour,
  slotDay,
} from "@/lib/mock/schedule";
import { CalendarGlyph, ClockGlyph } from "@/components/ui/meta-icons";
import { WizardStepRail } from "@/components/ui/wizard-step-rail";
import { theme } from "@/config/theme";

const STEP_LABEL = {
  teren: "Teren",
  zi: "Program",
  date: "Date",
} as const;

type StepId = keyof typeof STEP_LABEL;

function NewBookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const lockedPitchId = params.get("pitchId");
  const preselectedSlot = useMemo(() => {
    const id = params.get("slotId");
    return id ? getSlot(id) : undefined;
  }, [params]);
  const initialPitch =
    lockedPitchId ?? preselectedSlot?.pitchId ?? pitches[0]?.id ?? "";
  const initialDay = preselectedSlot
    ? slotDay(preselectedSlot.startsAt)
    : "";
  const initialSlotId = preselectedSlot?.id ?? "";

  const [pitchId, setPitchId] = useState(initialPitch);
  const [day, setDay] = useState(initialDay);
  const [slotId, setSlotId] = useState(initialSlotId);
  const [players, setPlayers] = useState(8);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [dir, setDir] = useState<"forward" | "back">("forward");

  const pitchLocked = Boolean(lockedPitchId && getPitch(lockedPitchId));
  const pitch = getPitch(pitchId);
  const steps = useMemo<StepId[]>(
    () => (pitchLocked ? ["zi", "date"] : ["teren", "zi", "date"]),
    [pitchLocked],
  );
  const [step, setStep] = useState(() =>
    initialSlotId ? Math.max(0, steps.indexOf("date")) : 0,
  );
  const stepId = steps[Math.min(step, steps.length - 1)] ?? "zi";
  const days = useMemo(() => availableDays(pitchId), [pitchId]);
  const hours = useMemo(
    () => (day ? freeBookableHoursForDay(pitchId, day) : []),
    [pitchId, day],
  );
  const total = pitch ? bookingPriceRon(pitch) : 0;
  const chosen =
    hours.find((slot) => slot.id === slotId) ??
    (slotId === preselectedSlot?.id ? preselectedSlot : undefined);

  const sameCityPitches = useMemo(() => {
    if (!pitch) return pitches;
    return pitches.filter((item) => item.oras === pitch.oras);
  }, [pitch]);

  useEffect(() => {
    if (slotId && hours.some((hour) => hour.id === slotId)) return;
    setSlotId("");
  }, [day, hours, slotId]);

  function go(next: number) {
    setDir(next < step ? "back" : "forward");
    setStep(next);
  }

  function goTo(id: StepId) {
    const next = steps.indexOf(id);
    if (next >= 0) go(next);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stepId !== "date") return;
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
      seatsNeeded: players,
      status: "pending",
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
      className="mx-auto flex w-full max-w-3xl flex-col px-[var(--page-gutter)] py-8 sm:py-12"
    >
      <header className="mb-8">
        <h1 className="font-display text-[length:var(--type-h1)] font-semibold tracking-tight text-[var(--color-ivory)]">
          Rezervă
        </h1>
        {pitchLocked && pitch ? (
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[var(--color-ivory)]">
            <span className="text-sm font-semibold text-[var(--color-coral)]">
              Teren ales
            </span>
            <span className="font-semibold">{pitch.name}</span>
            <span className="text-sm opacity-80">
              {pitch.oras} · {pitch.zona}
            </span>
            <Link
              href="/terenuri"
              className="text-sm font-semibold underline underline-offset-4"
            >
              Alege alt teren
            </Link>
          </p>
        ) : null}
      </header>

      <div
        key={`${stepId}-${dir}`}
        className={dir === "back" ? "wizard-back" : "wizard-forward"}
      >
        {stepId === "teren" ? (
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
              goTo("zi");
            }}
          />
        ) : null}

        {stepId === "zi" ? (
          days.length === 0 ? (
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
            <div className="flex flex-col gap-6">
              <BookingCalendar
                availableDays={days}
                selectedDay={day}
                onSelectDay={(value) => {
                  setDay(value);
                  setSlotId("");
                }}
              />
              {day ? (
                <div aria-live="polite">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-ivory)]">
                    {formatDayLong(day)}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-coral)]">
                    Alege un interval — poți schimba ziua din calendar oricând.
                  </p>
                  {hours.length === 0 ? (
                    <p className="mt-5 max-w-[36ch] text-[var(--color-ivory)]">
                      <span className="font-display text-xl font-semibold">
                        Nicio oră liberă
                      </span>
                      <span className="mt-2 block text-[var(--color-coral)]">
                        Toate orele sunt ocupate. Alege altă zi din calendar.
                      </span>
                    </p>
                  ) : (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {hours.map((slot) => {
                        const active = slot.id === slotId;
                        const label = `${formatHour(slot.startsAt)}–${formatHour(slot.endsAt)}`;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => {
                              setSlotId(slot.id);
                              goTo("date");
                            }}
                            className="min-w-[5.5rem] rounded-[var(--radius-sm)] px-5 py-3 text-base font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                            style={{
                              backgroundColor: active
                                ? theme.colors.coral
                                : theme.colors.ivory,
                              color: active
                                ? theme.colors.onCoral
                                : theme.colors.forest,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[var(--color-ivory)] opacity-75">
                  Alege o zi din calendar ca să vezi orele libere.
                </p>
              )}
            </div>
          )
        ) : null}

        {stepId === "date" ? (
          <div className="flex flex-col gap-6">
            <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl font-semibold tracking-tight text-[var(--color-ivory)]">
              <span className="inline-flex items-center gap-2">
                <CalendarGlyph />
                {day ? formatDayLong(day) : "Date"}
              </span>
              {chosen ? (
                <span className="inline-flex items-center gap-2 tabular-nums">
                  <ClockGlyph />
                  {formatHour(chosen.startsAt)}–{formatHour(chosen.endsAt)}
                </span>
              ) : null}
            </h2>
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
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] opacity-55">
                  Câți sunteți
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-ivory)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] px-1 py-1">
                  <button
                    type="button"
                    aria-label="Scade jucători"
                    disabled={players <= 1}
                    onClick={() => setPlayers((n) => Math.max(1, n - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-[var(--color-ivory)] transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] enabled:active:scale-[0.94] disabled:opacity-30"
                  >
                    −
                  </button>
                  <input
                    aria-label="Câți sunteți"
                    name="players"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={pitch?.capacity ?? 14}
                    value={players}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      if (!Number.isFinite(next)) return;
                      const max = pitch?.capacity ?? 14;
                      setPlayers(Math.min(max, Math.max(1, next)));
                    }}
                    className="w-12 border-0 bg-transparent text-center font-display text-xl font-semibold tabular-nums text-[var(--color-ivory)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label="Crește jucători"
                    disabled={players >= (pitch?.capacity ?? 14)}
                    onClick={() =>
                      setPlayers((n) =>
                        Math.min(pitch?.capacity ?? 14, n + 1),
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-[var(--color-ivory)] transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] enabled:active:scale-[0.94] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-sm text-[var(--color-ivory)] opacity-65">
                  {(pitch?.capacity ?? 14) - players > 0
                    ? `${(pitch?.capacity ?? 14) - players} locuri libere din ${pitch?.capacity ?? 14}`
                    : `Complet · ${pitch?.capacity ?? 14} / ${pitch?.capacity ?? 14}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] opacity-55">
                  Total
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--color-ivory)]">
                  {formatRon(total)}
                  <span className="ml-1.5 text-sm font-sans font-medium opacity-55">
                    / oră
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {step === 0 ? (
          <Button asChild variant="ghost">
            <Link href={pitch ? `/terenuri/${pitch.id}` : "/terenuri"}>
              Înapoi
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={() => go(step - 1)}>
            Înapoi
          </Button>
        )}
        {stepId === "date" ? (
          <Button type="submit" variant="accent" disabled={!slotId}>
            Rezervă
          </Button>
        ) : null}
      </div>

      <WizardStepRail
        steps={steps.map((id) => STEP_LABEL[id])}
        index={step}
        onSelect={go}
        tone="dark"
        className="mt-10"
      />
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
