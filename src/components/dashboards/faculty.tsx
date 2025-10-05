"use client";
import CurrentAvailableRooms from "./_components/all-users/current-available-rooms";
import FacultyCurrentSchedule from "./_components/faculty/faculty-current-schedule";
import ReceivedRoomRequest from "./_components/faculty/received-room-request";
export default function FacultyDashBoard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-5 sm:flex-row">
        <FacultyCurrentSchedule />
        <ReceivedRoomRequest />
      </div>

      <CurrentAvailableRooms />
    </div>
  );
}
