"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ReceivedRoomSkeleton } from "../skeletons/received-room-skeleton";
import { PageRoutes } from "@/constants/page-routes";
import { formatISODate, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import {
  ExternalLink,
  Calendar,
  Clock,
  User,
  Package,
  MapPin,
} from "lucide-react";
export default function UpcomingVenueReservation() {
  const { data: UpcomingVenueReservation, isLoading } =
    api.venue.getAllUpcomingVenueReservations.useQuery();

  const handleOpenRequest = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}${PageRoutes.REQUESTS}`,
      "_blank",
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-md font-semibold">
          Upcoming Venue Reservation
        </CardTitle>
        <Button
          className="bg-primary text-white"
          size="sm"
          onClick={handleOpenRequest}
        >
          <ExternalLink className="h-4 w-4 text-white" />
          View Request
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <ReceivedRoomSkeleton />
        ) : UpcomingVenueReservation?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No upcoming Venue borrowing.
          </p>
        ) : (
          UpcomingVenueReservation?.map((reservation) => (
            <div key={reservation.venueReservationId} className="w-full">
              <Card className="border-border gap-2 px-4 transition-shadow hover:shadow-md">
                <div className="space-y-2">
                  <CardHeader className="p-0">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <div className="flex items-center gap-2">
                        <div className="border-primary/30 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg border">
                          <MapPin className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-md">
                            {reservation.purpose}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {reservation.venueName}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 md:text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-gray-400 md:h-4 md:w-4" />
                          <span>
                            {reservation.date
                              ? formatISODate(reservation.date)
                              : "NA"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-gray-400 md:h-4 md:w-4" />
                          <span>
                            {`${TIME_MAP[toTimeInt(reservation.startTime)]}`} -{" "}
                            {`${TIME_MAP[toTimeInt(reservation.endTime)]}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-gray-400" />
                        Borrower: <span>{reservation.reserverName}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
