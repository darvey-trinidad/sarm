"use client";
import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";
import FacilityManagerStatusCards from "./_components/facility-manager/manager-status-cards";
import UpcomingResourceBorrowing from "./_components/facility-manager/upcoming-resource-borrowing";
export default function FacilityManagerDashBoard() {
  return (
    <div className="space-y-4">
      <FacilityManagerStatusCards />
      <UpcomingResourceBorrowing />
      <CurrentAvailableRooms />
    </div>
  );
}
