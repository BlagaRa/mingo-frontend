import { ALL_START_HOURS } from "./hours";

function clampHour(hh: string): string {
  if (hh.length === 0) return hh;
  if (hh.length === 1) return hh;
  const n = Number(hh);
  if (!Number.isFinite(n)) return "00";
  return String(Math.min(23, Math.max(0, n))).padStart(2, "0");
}

function clampMinute(mm: string): string {
  if (mm.length === 0) return mm;
  if (mm.length === 1) return mm;
  const n = Number(mm);
  if (!Number.isFinite(n)) return "00";
  return String(Math.min(59, Math.max(0, n))).padStart(2, "0");
}

/** Digits + optional colon, max HH:mm while typing; clamps hourâ‰¤23, minuteâ‰¤59. */
export function normalizeTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return clampHour(digits);
  return `${clampHour(digits.slice(0, 2))}:${clampMinute(digits.slice(2))}`;
}

/** Valid half-hour start on the owner grid, or null. */
export function parseTimeInput(raw: string): string | null {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hh = String(Number(match[1])).padStart(2, "0");
  const mm = match[2]!;
  const value = `${hh}:${mm}`;
  return ALL_START_HOURS.includes(value) ? value : null;
}
