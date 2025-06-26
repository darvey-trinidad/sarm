export const PRIORITY_LEVEL = [
  "low",
  "mid",
  "high"
] as const;

export type PriorityLevel = (typeof PRIORITY_LEVEL)[number];