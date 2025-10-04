"use client";
import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";
import FacilityManagerStatusCards from "./_components/facility-manager/manager-status-cards";
export default function FacilityManagerDashBoard() {
  return (
    <div className="space-y-4">
      <FacilityManagerStatusCards />
      <CurrentAvailableRooms />
    </div>
  );
}
