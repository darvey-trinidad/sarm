"use client";

import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";

export default function ClassroomManagerDashBoard() {
  return (
    <div className="space-y-4">
      <CurrentAvailableRooms />
    </div>
  );
}
