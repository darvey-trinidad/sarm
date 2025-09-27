"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Wrench, CircleCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function reportCards() {
  const { data: session } = authClient.useSession();
  const Pending = 12;
  const InProgress = 2;
  const Completed = 8;

  if (session?.user.role !== "facility_manager") {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Pending</CardTitle>
          <Clock className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Pending}</div>
          <p className="text-muted-foreground text-xs">+2 since yesterday</p>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">In Progress</CardTitle>
          <Wrench className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{InProgress}</div>
          <p className="text-muted-foreground text-xs">+3 since yesterday</p>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Resolved</CardTitle>
          <CircleCheck className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Completed}</div>
          <p className="text-muted-foreground text-xs">+5 since yesterday</p>
        </CardContent>
      </Card>
    </div>
  );
}
