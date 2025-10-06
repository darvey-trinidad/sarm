"use client";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export default function NoReportsuser() {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground text-lg font-semibold">
            No data found
          </h3>
          <p className="text-muted-foreground">
            You have not madde any reservations yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
