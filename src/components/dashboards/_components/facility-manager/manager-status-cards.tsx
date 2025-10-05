"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarCheck, Package, CircleAlert } from "lucide-react";

export default function FacilityManagerStatusCards() {
  const reservations = 12;
  const borrowings = 2;
  const issues = 8;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Pending Reservations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Pending Reservations
          </CardTitle>
          <CalendarCheck className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reservations}</div>
        </CardContent>
      </Card>

      {/* Pending Borrowings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Pending Borrowings
          </CardTitle>
          <Package className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{borrowings}</div>
        </CardContent>
      </Card>

      {/* Unresolved Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">
            Unresolved Issues
          </CardTitle>
          <CircleAlert className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{issues}</div>
        </CardContent>
      </Card>

      {/* TO FOLLOW */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">EMPTY</CardTitle>
          <CalendarCheck className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{"EMPTY"}</div>
        </CardContent>
      </Card>
      {/* TO FOLLOW */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">EMPTY</CardTitle>
          <CalendarCheck className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{"EMPTY"}</div>
        </CardContent>
      </Card>
      {/* TO FOLLOW */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">EMPTY</CardTitle>
          <CalendarCheck className="text-primary h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {"EMPTY"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
