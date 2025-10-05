export const REPORT_CATEGORY = [
  "plumbing",
  "electrical",
  "equipment",
  "sanitation",
  "other",
] as const;

export type ReportCategory = (typeof REPORT_CATEGORY)[number];

export const REPORT_CATEGORY_OPTIONS = REPORT_CATEGORY.map((category) => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));
