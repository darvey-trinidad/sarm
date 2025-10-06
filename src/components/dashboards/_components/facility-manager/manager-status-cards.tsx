"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarCheck, Package, CircleAlert } from "lucide-react";
import VenueBorrowingChart from "./charts/venue-borrowing-chart";
import RoomRequestPerDeptChart from "./charts/classroom-type-pie-chart";
import ClassroomBorrowingDeptChart from "./charts/classroom-borrowing-department";
import { api } from "@/trpc/react";

export default function FacilityManagerStatusCards() {
  const { data: reservationBorrowingIssueCounts, isLoading } = api.stats.getReservationBorrowingIssueCounts.useQuery();

  const {
    unresolvedReportsCount,
    pendingBorrowingTransactionsCount,
    pendingVenueReservationsCount
  } = reservationBorrowingIssueCounts ?? {
    unresolvedReportsCount: 0,
    pendingBorrowingTransactionsCount: 0,
    pendingVenueReservationsCount: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Pending Reservations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Pending Reservations
          </CardTitle>
          <CalendarCheck className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : pendingVenueReservationsCount}</div>
        </CardContent>
      </Card>

      {/* Pending Borrowings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Pending Borrowings
          </CardTitle>
          <Package className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : pendingBorrowingTransactionsCount}</div>
        </CardContent>
      </Card>

      {/* Unresolved Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Unresolved Issues
          </CardTitle>
          <CircleAlert className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : unresolvedReportsCount}</div>
        </CardContent>
      </Card>

      {/* Area Chart */}

      <VenueBorrowingChart />
      <RoomRequestPerDeptChart />
      <ClassroomBorrowingDeptChart />
    </div>
  );
}
