"use client";

import UserResourceBorrowings from "./_components/student-organization/users-resource-borrowings";
import UsersVenueReservation from "./_components/student-organization/users-venue-reservation";

export default function StudentOrganizationDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UserResourceBorrowings />
        <UsersVenueReservation />
      </div>
    </div>
  );
}
