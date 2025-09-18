export const USABILITY = ["operational", "non-operational"] as const;

export const DEFAULT_USABILITY = USABILITY[0];

export type Usability = (typeof USABILITY)[number];

export const USABILITY_OPTIONS = USABILITY.map((usability) => ({
  value: usability,
  label: usability.charAt(0).toUpperCase() + usability.slice(1),
}));
