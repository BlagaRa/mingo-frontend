import type { Pitch } from "./types";

/** First traits shown under photos — capped at 5. */
export function pitchFeatureLabels(pitch: Pitch, limit = 5): string[] {
  const features = [
    pitch.surface,
    pitch.indoor ? "Interior" : "Exterior",
    pitch.covered ? "Acoperit" : "Descoperit",
    pitch.nightLights ? "Nocturnă" : null,
    `${pitch.capacity} jucători`,
  ].filter((item): item is string => Boolean(item));

  return features.slice(0, limit);
}
