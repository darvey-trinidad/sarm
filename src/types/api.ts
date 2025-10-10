export type BorrowingReportError = {
  error: string;
};

export type BorrowingReportRequest = {
  status?: string;
  startDate?: string;
  endDate?: string;
};