"use client";
import { Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export default function ReadySearch() {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <Filter className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            Ready to search
          </h3>
          <p className="text-muted-foreground">
            Please fill in the date, start time, and end time to find available
            classrooms.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
