import { Card, CardContent } from "@/components/ui/card";
import { School, DoorClosed, CalendarX } from "lucide-react";
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
            No Schedules Found
          </h3>
          <p className="text-muted-foreground">
            You don't have any scheduled classes at the moment. Check back later
            or contact administration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
