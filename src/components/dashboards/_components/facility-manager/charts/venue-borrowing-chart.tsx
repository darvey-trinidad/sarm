import { api } from "@/trpc/react";
export default function VenueBorrowingChart() {
  const { data: venueBorrowingComparison, isLoading } =
    api.venue.getVenueReservationPastMonthsStats.useQuery();
  return <div>this is a chart</div>;
}
