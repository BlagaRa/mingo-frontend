"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  bookingPriceRon,
  formatDateTime,
  formatRon,
  getBooking,
  getPitch,
  getSlot,
  openSeats,
} from "@/lib/mock/queries";
import { theme } from "@/config/theme";

export default function RezervareDetailPage() {
  const params = useParams<{ id: string }>();
  const booking = getBooking(params.id);
  const [joined, setJoined] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  if (!booking) {
    return (
      <PageShell title="Rezervări">
        <ErrorState
          title="Rezervarea nu e aici"
          description="Linkul poate fi vechi sau rezervarea a fost ștearsă. Revino la listă."
          action={
            <Button asChild variant="accent">
              <Link href="/rezervari">Înapoi la rezervări</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const pitch = getPitch(booking.pitchId);
  const slot = getSlot(booking.slotId);
  const seats = Math.max(0, openSeats(booking) - (joined ? 1 : 0));
  const players = booking.playerIds.length + (joined ? 1 : 0);
  const total = pitch ? bookingPriceRon(pitch) : null;
  const status = cancelled ? "cancelled" : booking.status;

  return (
    <PageShell
      title={pitch?.name ?? "Rezervare"}
      description={slot ? formatDateTime(slot.startsAt) : undefined}
      actions={
        <Button variant="danger" onClick={() => setCancelOpen(true)}>
          Anulează
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-2xl gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-4"
            style={{ backgroundColor: theme.colors.surfaceMuted }}
          >
            <p className="text-xs opacity-70">Status</p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>
          {[
            {
              label: "Preț",
              value: pitch
                ? `${formatRon(pitch.pricePerHourRon)} / oră`
                : "pe oră",
            },
            { label: "Jucători", value: `${players}/${booking.seatsNeeded}` },
            { label: "Libere", value: String(seats) },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-4"
              style={{ backgroundColor: theme.colors.surfaceMuted }}
            >
              <p className="text-xs opacity-70">{item.label}</p>
              <p className="mt-1 font-semibold capitalize text-[var(--color-forest)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {total != null ? (
          <p className="text-sm">
            Total estimat: <strong>{formatRon(total)}</strong>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {seats > 0 && !cancelled ? (
            <Button
              variant="accent"
              onClick={() => setJoined(true)}
              disabled={joined}
            >
              {joined ? "Ești pe listă" : "Alătură-te"}
            </Button>
          ) : null}
          <Button asChild variant="primary">
            <Link href={`/rezervari/nou?pitchId=${booking.pitchId}`}>
              Rezervă acum
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/terenuri/${booking.pitchId}`}>Vezi terenul</Link>
          </Button>
        </div>
      </div>

      <Dialog
        open={cancelOpen}
        title="Anulezi rezervarea?"
        description="Doar demo — nu șterge date reale."
        confirmLabel="Anulează"
        tone="danger"
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          setCancelled(true);
          setCancelOpen(false);
        }}
      />
    </PageShell>
  );
}
