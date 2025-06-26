export const USABILITY = [
  "operational", 
  "non-operational"
] as const;

export type usability = (typeof USABILITY)[number];