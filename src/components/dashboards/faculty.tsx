"use client";
import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";
import FacultyCurrentSchedule from "./_components/faculty/faculty-current-schedule";
export default function FacultyDashBoard() {
  return (
    <div className="space-y-4">
      <FacultyCurrentSchedule />
      <CurrentAvailableRooms />
    </div>
  );
}
