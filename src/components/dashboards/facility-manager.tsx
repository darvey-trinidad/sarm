"use client";
import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";
import FacilityManagerStatusCards from "./_components/facility-manager/manager-status-cards";
import UpcomingResourceBorrowing from "./_components/facility-manager/upcoming-resource-borrowing";
import UpcomingVenueReservation from "./_components/facility-manager/upcoming-venue-reservation";
export default function FacilityManagerDashBoard() {
  return (
    <div className="space-y-4">
      <FacilityManagerStatusCards />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UpcomingResourceBorrowing />
        <UpcomingVenueReservation />
      </div>
      <CurrentAvailableRooms />
    </div>
  );
}
