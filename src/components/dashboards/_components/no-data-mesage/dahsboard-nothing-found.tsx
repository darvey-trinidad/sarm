import { Card, CardContent } from "@/components/ui/card";
import {
  School,
  DoorClosed,
  CalendarX,
  PackageX,
  MapPinX,
  MessageSquareWarning,
} from "lucide-react";
export const NoAvailableClasses = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <School className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Available Classrooms Found
          </h3>
          <p className="text-muted-foreground">
            There are no available classrooms at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoRoomRequest = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <DoorClosed className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Room Requests
          </h3>
          <p className="text-muted-foreground">
            No one requested a classroom at the moment .
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoScheduleFound = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <CalendarX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Schedules Right Now
          </h3>
          <p className="text-muted-foreground">
            You don&apos;t have any scheduled classes at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoUpcomingVenueReservations = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <MapPinX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Upcoming Venue Reservations
          </h3>
          <p className="text-muted-foreground">
            There are no upcoming venue reservations at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserNoVenueReservations = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <MapPinX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Venue Reservations
          </h3>
          <p className="text-muted-foreground">
            You have not made any venue reservations yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoUpcomingResourceBorrowing = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <PackageX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Upcoming Resource Borrowings
          </h3>
          <p className="text-muted-foreground">
            There are no upcoming resource borrowings at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserNoResourceBorrowings = () => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <PackageX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Resource Borrowings
          </h3>
          <p className="text-muted-foreground">
            You have not made any resource borrowings yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoUpcomingFacilityIssuesReports = () => {
  <Card className="border-none shadow-none">
    <CardContent className="flex items-center justify-center py-12">
      <div className="text-center">
        <MessageSquareWarning className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="text-foreground text-lg font-semibold">
          No Recent Facility Issue Reports
        </h3>
        <p className="text-muted-foreground">
          There are no recent facility issue reports at the moment.
        </p>
      </div>
    </CardContent>
  </Card>;
};
