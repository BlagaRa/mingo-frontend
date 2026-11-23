import { startHoursInWindow } from "./hours";

export type PitchProgram = {
  startHour: string;
  endHour: string;
};

const DEFAULT_PROGRAM: PitchProgram = {
  startHour: "08:00",
  endHour: "20:30",
};

let programs = new Map<string, PitchProgram>();
let closedDays = new Map<string, Set<string>>();
let closedHours = new Map<string, Set<string>>();

function dayKey(pitchId: string, day: string): string {
  return `${pitchId}|${day}`;
}

export { startHoursInWindow };

export function resetProgramStore(): void {
  programs = new Map();
  closedDays = new Map();
  closedHours = new Map();
}

export function getPitchProgram(pitchId: string): PitchProgram {
  return programs.get(pitchId) ?? { ...DEFAULT_PROGRAM };
}

export function setPitchProgram(
  pitchId: string,
  startHour: string,
  endHour: string,
): void {
  programs.set(pitchId, { startHour, endHour });
}

export function isDayClosed(pitchId: string, day: string): boolean {
  return closedDays.get(pitchId)?.has(day) ?? false;
}

export function isHourClosed(
  pitchId: string,
  day: string,
  startHour: string,
): boolean {
  return closedHours.get(dayKey(pitchId, day))?.has(startHour) ?? false;
}

export function setHourClosed(
  pitchId: string,
  day: string,
  startHour: string,
  closed: boolean,
): void {
  const key = dayKey(pitchId, day);
  let set = closedHours.get(key);
  if (!set) {
    set = new Set();
    closedHours.set(key, set);
  }
  if (closed) set.add(startHour);
  else set.delete(startHour);
}

export function clearDayHourClosures(pitchId: string, day: string): void {
  closedHours.delete(dayKey(pitchId, day));
}

export function setDayClosedFlag(
  pitchId: string,
  day: string,
  closed: boolean,
): void {
  let days = closedDays.get(pitchId);
  if (!days) {
    days = new Set();
    closedDays.set(pitchId, days);
  }
  if (closed) days.add(day);
  else days.delete(day);
}

/** True when the start is inside the program window and not closed. */
export function isProgramStartOpen(
  pitchId: string,
  day: string,
  startHour: string,
): boolean {
  const program = getPitchProgram(pitchId);
  const inWindow = startHoursInWindow(
    program.startHour,
    program.endHour,
  ).includes(startHour);
  if (!inWindow) return false;
  if (isHourClosed(pitchId, day, startHour)) return false;
  return true;
}

export function closedDaysForPitch(pitchId: string): Set<string> {
  return new Set(closedDays.get(pitchId) ?? []);
}

export function programHoursForPitch(pitchId: string): string[] {
  const program = getPitchProgram(pitchId);
  return startHoursInWindow(program.startHour, program.endHour);
}
