export const REPORT_STATUS = [
  "reported",
  "ongoing",
  "resolved",
] as const;

export const DEFAULT_REPORT_STATUS = REPORT_STATUS[0];

export type ReportStatus = (typeof REPORT_STATUS)[number];