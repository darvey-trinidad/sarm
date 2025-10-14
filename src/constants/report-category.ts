export const REPORT_CATEGORY = [
  "plumbing",
  "electrical",
  "equipment",
  "sanitation",
  "other",
] as const;

export const ReportCategoryStatus = {
  Plumbing: REPORT_CATEGORY[0],
  Electrical: REPORT_CATEGORY[1],
  Equipment: REPORT_CATEGORY[2],
  Sanitation: REPORT_CATEGORY[3],
  Other: REPORT_CATEGORY[4],
};

export type ReportCategory = (typeof REPORT_CATEGORY)[number];

export const REPORT_CATEGORY_OPTIONS = REPORT_CATEGORY.map((category) => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));
