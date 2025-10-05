export const REPORT_STATUS = [
  "reported",
  "ongoing",
  "resolved",
  "duplicate",
] as const;

export const ReportStatusValues = {
  Reported: REPORT_STATUS[0],
  Ongoing: REPORT_STATUS[1],
  Resolved: REPORT_STATUS[2],
  Duplicate: REPORT_STATUS[3],
};

export const DEFAULT_REPORT_STATUS = REPORT_STATUS[0];

export type ReportStatus = (typeof REPORT_STATUS)[number];

export const REPORT_STATUS_OPTIONS = REPORT_STATUS.map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));
