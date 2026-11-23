/** Half-hour starts from 06:00 through 23:30 (max program window). */
export const ALL_START_HOURS: string[] = Array.from({ length: 36 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
});

export function startHoursInWindow(
  startHour: string,
  endHour: string,
): string[] {
  return ALL_START_HOURS.filter((h) => h >= startHour && h <= endHour);
}

/** Default program window starts (08:00–20:30 inclusive). */
export const OWNER_START_HOURS: string[] = startHoursInWindow("08:00", "20:30");

export function buildSlotRange(
  day: string,
  startHour: string,
): { startsAt: string; endsAt: string } {
  const [h, m] = startHour.split(":").map(Number) as [number, number];
  const start = `${day}T${startHour}:00+02:00`;
  const endTotal = h * 60 + m + 60;
  const eh = String(Math.floor(endTotal / 60) % 24).padStart(2, "0");
  const em = String(endTotal % 60).padStart(2, "0");
  let endDay = day;
  if (endTotal >= 24 * 60) {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    endDay = `${y}-${mo}-${da}`;
  }
  return { startsAt: start, endsAt: `${endDay}T${eh}:${em}:00+02:00` };
}
