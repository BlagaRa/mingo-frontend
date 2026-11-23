"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { listBookings, upsertBooking } from "@/lib/mock/booking-store";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { isValidRoPhone } from "@/lib/mock/phone";
import { formatHour, freeHoursForDay } from "@/lib/mock/schedule";
import type { Pitch } from "@/lib/mock/types";

type Props = {
  pitches: Pitch[];
  day: string;
  onDone: () => void;
};

export function OwnerCreateBookingForm({ pitches, day, onDone }: Props) {
  const [pitchId, setPitchId] = useState(pitches[0]!.id);
  const [slotId, setSlotId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const taken = new Set(
    listBookings()
      .filter((b) => b.status !== "cancelled")
      .map((b) => b.slotId),
  );
  const free = freeHoursForDay(pitchId, day).filter((s) => !taken.has(s.id));
  const chosen = free.some((s) => s.id === slotId) ? slotId : free[0]?.id;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidRoPhone(contactPhone)) {
      setPhoneError("Introdu un telefon valid (07…)");
      return;
    }
    upsertBooking({
      id: `b-${Date.now()}`,
      pitchId,
      slotId: chosen!,
      hostId: DEMO_OWNER_ID,
      playerIds: [DEMO_OWNER_ID],
      status: "confirmed",
      seatsNeeded: 1,
      contactName,
      contactEmail,
      contactPhone,
    });
    onDone();
  }

  return (
    <form
      aria-label="Rezervare nouă"
      onSubmit={onSubmit}
      className="mb-6 grid gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-surface-muted)] p-4 sm:grid-cols-2"
    >
      <SelectField
        label="Teren"
        value={pitchId}
        options={pitches.map((p) => ({ value: p.id, label: p.name }))}
        onValueChange={setPitchId}
      />
      {free.length === 0 ? (
        <p className="self-end text-sm text-[var(--color-forest-fill)]">
          Nicio oră liberă pe terenul ales
        </p>
      ) : (
        <SelectField
          label="Ora"
          value={chosen}
          options={free.map((s) => ({ value: s.id, label: formatHour(s.startsAt) }))}
          onValueChange={setSlotId}
        />
      )}
      <Input
        label="Nume"
        required
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        required
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />
      <Input
        label="Telefon"
        type="tel"
        required
        value={contactPhone}
        error={phoneError}
        onChange={(e) => {
          setContactPhone(e.target.value);
          setPhoneError("");
        }}
      />
      <div className="flex items-end gap-3 sm:col-span-2">
        <Button type="submit" variant="accent" disabled={!chosen}>
          Salvează
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Renunță
        </Button>
      </div>
    </form>
  );
}
