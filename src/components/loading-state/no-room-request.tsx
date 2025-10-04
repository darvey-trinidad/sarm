import { DoorClosed } from "lucide-react";
import { Card, CardContent } from "../ui/card";
export default function NoRoomRequest() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <DoorClosed className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Room Requests
          </h3>
          <p className="text-muted-foreground">
            There are no room requests at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
