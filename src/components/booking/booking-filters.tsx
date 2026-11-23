"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
  BOOKING_STATUS_FILTERS,
  bookingStatusLabel,
} from "@/lib/mock/booking-display";
import { bookings, getPitch } from "@/lib/mock/queries";
import { theme } from "@/config/theme";

export function BookingFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const pitchId = params.get("pitchId") ?? "";

  const pitchOptions = useMemo(() => {
    const ids = [...new Set(bookings.map((booking) => booking.pitchId))];
    return ids
      .map((id) => {
        const pitch = getPitch(id);
        return pitch
          ? { value: pitch.id, label: pitch.name }
          : { value: id, label: id };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "ro"));
  }, []);

  function update(next: Record<string, string>) {
    const search = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) search.delete(key);
      else search.set(key, value);
    }
    const query = search.toString();
    router.replace(query ? `/rezervari?${query}` : "/rezervari", {
      scroll: false,
    });
  }

  const hasFilters = Boolean(status || pitchId);

  return (
    <section
      aria-label="Filtre rezervări"
      className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Status">
        <button
          type="button"
          aria-pressed={!status}
          onClick={() => update({ status: "" })}
          className="rounded-full px-3 py-1.5 text-xs font-semibold transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
          style={{
            backgroundColor: !status
              ? theme.colors.coral
              : theme.colors.surfaceMuted,
            color: !status ? theme.colors.onCoral : theme.colors.ivory,
            boxShadow: !status
              ? "none"
              : "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 14%, transparent)",
          }}
        >
          Toate
        </button>
        {BOOKING_STATUS_FILTERS.map((value) => {
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => update({ status: active ? "" : value })}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
              style={{
                backgroundColor: active
                  ? theme.colors.coral
                  : theme.colors.surfaceMuted,
                color: active ? theme.colors.onCoral : theme.colors.ivory,
                boxShadow: active
                  ? "none"
                  : "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 14%, transparent)",
              }}
            >
              {bookingStatusLabel(value)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Combobox
          className="min-w-[12rem] sm:min-w-[14rem]"
          label="Teren"
          emptyLabel="Toate terenurile"
          value={pitchId}
          options={pitchOptions}
          onValueChange={(value) => update({ pitchId: value })}
        />
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              router.replace("/rezervari", { scroll: false });
            }}
            className="mb-0.5 text-sm font-semibold text-[var(--color-coral)] underline-offset-4 transition-opacity duration-[var(--motion-press-ms)] ease-[var(--ease-out)] hover:underline active:opacity-70"
          >
            Resetează
          </button>
        ) : null}
      </div>
    </section>
  );
}
