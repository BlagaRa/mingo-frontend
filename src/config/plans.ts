export type PlanId = "start" | "club" | "liga";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  blurb: string;
  extras: string[];
  featured?: boolean;
  featuredLabel?: string;
};

export const plans: Plan[] = [
  {
    id: "start",
    name: "Start",
    price: "0 RON",
    blurb: "Un teren, rezervări de bază.",
    extras: ["1 teren", "Calendar simplu", "Support email"],
  },
  {
    id: "club",
    name: "Club",
    price: "149 RON / lună",
    blurb: "Mai multe terenuri pe zonă, statistici.",
    extras: ["Până la 5 terenuri", "Statistici", "Anulări & rapoarte"],
    featured: true,
    featuredLabel: "Cel mai folosit",
  },
  {
    id: "liga",
    name: "Ligă",
    price: "349 RON / lună",
    blurb: "Operațiuni pe mai multe zone.",
    extras: ["Terenuri nelimitate", "Prioritate support", "Export date"],
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function planDisplayFeatures(plan: Plan): string[] {
  const index = plans.findIndex((entry) => entry.id === plan.id);
  if (index <= 0) return [...plan.extras];
  const previous = plans[index - 1]!;
  return [`Tot din ${previous.name}`, ...plan.extras];
}
