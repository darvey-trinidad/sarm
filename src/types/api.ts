export type BorrowingReportError = {
  error: string;
};

export type BorrowingReportRequest = {
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type VenueReservationReportRequest = {
  venueId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type VenueReservationReportError = {
  error: string;
};