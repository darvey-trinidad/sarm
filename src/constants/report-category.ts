export const REPORT_CATEGORY = [
  "plumbing",
  "electrical",
  "equipment",
  "sanitation",
  "other"
] as const;

export type ReportCategory = (typeof REPORT_CATEGORY)[number];