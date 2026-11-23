import { getSlot, ownerBookingStats, ownerPitches } from "./queries";
import { bookings } from "./fixtures";
import type { Booking } from "./types";

export type StatsPeriod = "today" | "week" | "month" | "custom";
export type StatsRange = { from: string; to: string };
export type ChartGrain = "hour" | "day" | "week" | "month";

/** Fixed demo "today" so period filters stay stable in tests. */
export const DEMO_STATS_TODAY = "2026-12-10";

function bookingDay(booking: Booking): string | null {
  const startsAt = getSlot(booking.slotId)?.startsAt;
  return startsAt ? startsAt.slice(0, 10) : null;
}

function bookingHour(booking: Booking): string | null {
  const startsAt = getSlot(booking.slotId)?.startsAt;
  return startsAt ? startsAt.slice(11, 13) + ":00" : null;
}

function parseDay(day: string): Date {
  return new Date(`${day}T12:00:00`);
}

function formatDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mondayOf(day: string): string {
  const d = parseDay(day);
  const dow = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - dow);
  return formatDay(d);
}

function monthBounds(day: string): StatsRange {
  const d = parseDay(day);
  const from = formatDay(new Date(d.getFullYear(), d.getMonth(), 1));
  const to = formatDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  return { from, to };
}

export function resolveStatsRange(
  period: StatsPeriod,
  custom?: StatsRange,
  today: string = DEMO_STATS_TODAY,
): StatsRange {
  if (period === "today") return { from: today, to: today };
  if (period === "week") {
    const from = mondayOf(today);
    const end = parseDay(from);
    end.setDate(end.getDate() + 6);
    return { from, to: formatDay(end) };
  }
  if (period === "month") return monthBounds(today);
  const from = custom?.from ?? today;
  const to = custom?.to ?? today;
  return from <= to ? { from, to } : { from: to, to: from };
}

export function chartGrainFor(
  period: StatsPeriod,
  range: StatsRange,
): ChartGrain {
  if (period === "today") return "hour";
  if (period === "week") return "day";
  if (period === "month") return "day";
  const start = parseDay(range.from);
  const end = parseDay(range.to);
  const days =
    Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  if (days <= 1) return "hour";
  if (days <= 45) return "day";
  if (days <= 120) return "week";
  return "month";
}

function inRange(day: string, range: StatsRange): boolean {
  return day >= range.from && day <= range.to;
}

function weekKey(day: string): string {
  return mondayOf(day);
}

function monthKey(day: string): string {
  return day.slice(0, 7);
}

function labelFor(key: string, grain: ChartGrain): string {
  if (grain === "hour") return key;
  if (grain === "month") {
    const [y, m] = key.split("-").map(Number) as [number, number];
    return new Intl.DateTimeFormat("ro-RO", {
      month: "short",
      year: "numeric",
    }).format(new Date(y, m - 1, 1));
  }
  if (grain === "week") {
    return `Săpt. ${new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "short",
    }).format(parseDay(key))}`;
  }
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "short",
  }).format(parseDay(key));
}

export function filterOwnerBookings(
  ownerId: string,
  pitchId: string,
  range: StatsRange,
): Booking[] {
  const mine = new Set(ownerPitches(ownerId).map((p) => p.id));
  return bookings.filter((booking) => {
    if (!mine.has(booking.pitchId)) return false;
    if (pitchId && booking.pitchId !== pitchId) return false;
    const day = bookingDay(booking);
    if (!day) return false;
    return inRange(day, range);
  });
}

export function ownerStatsReport(
  ownerId: string,
  pitchId: string,
  period: StatsPeriod,
  custom?: StatsRange,
) {
  const range = resolveStatsRange(period, custom);
  const grain = chartGrainFor(period, range);
  const related = filterOwnerBookings(ownerId, pitchId, range);
  const pitches = pitchId
    ? ownerPitches(ownerId).filter((p) => p.id === pitchId)
    : ownerPitches(ownerId);

  const buckets = new Map<string, number>();
  for (const booking of related) {
    const day = bookingDay(booking);
    if (!day) continue;
    let key = day;
    if (grain === "hour") {
      const hour = bookingHour(booking);
      if (!hour) continue;
      key = hour;
    } else if (grain === "week") {
      key = weekKey(day);
    } else if (grain === "month") {
      key = monthKey(day);
    }
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const seriesTitle =
    grain === "hour"
      ? "Rezervări pe oră"
      : grain === "week"
        ? "Rezervări pe săptămână"
        : grain === "month"
          ? "Rezervări pe lună"
          : "Rezervări pe zi";

  return {
    total: related.length,
    confirmed: related.filter((b) => b.status === "confirmed").length,
    cancelled: related.filter((b) => b.status === "cancelled").length,
    byPitch: pitches.map((pitch) => ({
      pitch,
      count: related.filter((b) => b.pitchId === pitch.id).length,
    })),
    grain,
    seriesTitle,
    series: [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        label: labelFor(key, grain),
        value,
      })),
  };
}

export function baselineOwnerTotal(ownerId: string): number {
  return ownerBookingStats(ownerId).total;
}
