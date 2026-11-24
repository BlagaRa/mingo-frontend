"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PitchWeekHours } from "@/components/pitches/pitch-week-hours";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarGlyph, ClockGlyph } from "@/components/ui/meta-icons";
import { WizardStepRail } from "@/components/ui/wizard-step-rail";
import { confirmBooking, upsertBooking } from "@/lib/mock/booking-store";
import { isValidRoPhone } from "@/lib/mock/phone";
import {
  bookingPriceRon,
  formatRon,
  getPitch,
  getSlot,
} from "@/lib/mock/queries";
import { formatDayLong, formatHour, slotDay } from "@/lib/mock/schedule";

const STEPS = ["Program", "Contact", "Confirmare"] as const;

export function PitchBookingPanel({
  pitchId,
  availableDays,
}: {
  pitchId: string;
  availableDays: string[];
}) {
  const router = useRouter();
  const pitch = getPitch(pitchId);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"forward" | "back">("forward");
  const [day, setDay] = useState("");
  const [slotId, setSlotId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [players, setPlayers] = useState(8);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [resendFeedback, setResendFeedback] = useState("");

  const slot = useMemo(() => (slotId ? getSlot(slotId) : undefined), [slotId]);
  const total = pitch ? bookingPriceRon(pitch) : 0;

  function go(next: number) {
    setDir(next < step ? "back" : "forward");
    if (next < step && next === 0) {
      setSlotId("");
    }
    setStep(next);
  }

  function onContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 1 || !slotId) return;
    if (!isValidRoPhone(contactPhone)) {
      setPhoneError("Introdu un telefon valid (07…)");
      return;
    }
    const id = bookingId || `b-${Date.now()}`;
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
    setBookingId(id);
    setCode("");
    setCodeError("");
    setResendFeedback("");
    go(2);
  }

  function onConfirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 2 || !bookingId) return;
    const trimmed = code.trim();
    if (trimmed.length !== 6) {
      setCodeError("Codul are 6 caractere. În demo acceptăm orice cod de 6.");
      return;
    }
    confirmBooking(bookingId);
    router.push(`/rezervari/${bookingId}`);
  }

  return (
    <div>
      <h2 className="font-display text-[var(--type-h3)] font-semibold text-[var(--color-forest)]">
        Rezervă
      </h2>

      <div className="mt-4">
        <WizardStepRail
          steps={STEPS}
          index={step}
          onSelect={go}
          tone="light"
          className="mb-6"
          aria-label="Progres rezervare"
        />
      </div>

      <div
        key={`${step}-${dir}`}
        className={dir === "back" ? "wizard-back" : "wizard-forward"}
      >
        {step === 0 ? (
          <PitchWeekHours
            pitchId={pitchId}
            availableDays={availableDays}
            selectedSlotId={slotId}
            onSelectSlot={(nextSlotId, nextDay) => {
              setSlotId(nextSlotId);
              setDay(nextDay || slotDay(getSlot(nextSlotId)?.startsAt ?? ""));
              go(1);
            }}
          />
        ) : null}

        {step === 1 ? (
          <form onSubmit={onContactSubmit} className="flex flex-col gap-4">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-semibold tracking-tight text-[var(--color-forest)]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarGlyph />
                {day ? formatDayLong(day) : "Contact"}
              </span>
              {slot ? (
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <ClockGlyph />
                  {formatHour(slot.startsAt)}–{formatHour(slot.endsAt)}
                </span>
              ) : null}
            </p>
            <Input
              tone="light"
              label="Nume"
              name="contactName"
              autoComplete="name"
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
            <Input
              tone="light"
              label="Email"
              name="contactEmail"
              type="email"
              autoComplete="email"
              required
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
            />
            <Input
              tone="light"
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
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-forest)] opacity-55">
                  Câți sunteți
                </p>
                <div
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-1 py-1"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-forest-fill) 10%, var(--color-ivory))",
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--color-forest-fill) 22%, transparent)",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Scade jucători"
                    disabled={players <= 1}
                    onClick={() => setPlayers((n) => Math.max(1, n - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-[var(--color-forest)] transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.94] disabled:opacity-30"
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
                    className="w-12 border-0 bg-transparent text-center font-display text-xl font-semibold tabular-nums text-[var(--color-forest)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-[var(--color-forest)] transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.94] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-sm text-[var(--color-forest)] opacity-65">
                  {(pitch?.capacity ?? 14) - players > 0
                    ? `${(pitch?.capacity ?? 14) - players} locuri libere din ${pitch?.capacity ?? 14}`
                    : `Complet · ${pitch?.capacity ?? 14} / ${pitch?.capacity ?? 14}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-forest)] opacity-55">
                  Total
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--color-forest)]">
                  {formatRon(total)}
                  <span className="ml-1.5 text-sm font-sans font-medium opacity-55">
                    / oră
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <Button type="button" variant="soft" onClick={() => go(0)}>
                Înapoi
              </Button>
              <Button type="submit" variant="accent" disabled={!slotId}>
                Rezervă
              </Button>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <form onSubmit={onConfirmCode} className="flex flex-col gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-[var(--color-forest)]">
                Confirmare
              </p>
              <p className="mt-2 text-sm text-[var(--color-forest)] opacity-70">
                Am trimis un cod către{" "}
                <span className="font-semibold">{contactEmail}</span>. Introdu-l
                ca să validezi rezervarea.
              </p>
            </div>
            <Input
              tone="light"
              label="Cod din email"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              spellCheck={false}
              maxLength={6}
              required
              value={code}
              error={codeError}
              onChange={(event) => {
                setCode(event.target.value);
                setCodeError("");
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="soft" onClick={() => go(1)}>
                Înapoi
              </Button>
              <Button type="submit" variant="accent">
                Confirmă rezervarea
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setResendFeedback("Am retrimis codul (demo).")}
            >
              Retrimite codul
            </Button>
            <p role="status" className="text-sm opacity-70">
              {resendFeedback || "Demo: orice cod de 6 caractere trece."}
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
}
