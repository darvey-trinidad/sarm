import { Card, CardContent } from "@/components/ui/card";
import { School } from "lucide-react";
export default function NoAvailableClasses() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <School className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No Available Classes Found
          </h3>
          <p className="text-muted-foreground">
            There are no available classrooms at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
