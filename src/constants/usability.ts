export const USABILITY = [
  "operational", 
  "non-operational"
] as const;

export const DEFAULT_USABILITY = USABILITY[0];

export type usability = (typeof USABILITY)[number];