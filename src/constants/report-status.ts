export const REPORT_STATUS = [
  "reported",
  "ongoing",
  "resolved",
] as const;

export const ReportStatusValues = {
  Reported: REPORT_STATUS[0],
  Ongoing: REPORT_STATUS[1],
  Resolved: REPORT_STATUS[2],
}

export const DEFAULT_REPORT_STATUS = REPORT_STATUS[0];

export type ReportStatus = (typeof REPORT_STATUS)[number];