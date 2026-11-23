let hidden = new Set<string>();

export function resetPitchVisibilityStore(): void {
  hidden = new Set();
}

export function isPitchVisible(pitchId: string): boolean {
  return !hidden.has(pitchId);
}

export function setPitchVisible(pitchId: string, visible: boolean): void {
  if (visible) hidden.delete(pitchId);
  else hidden.add(pitchId);
}
