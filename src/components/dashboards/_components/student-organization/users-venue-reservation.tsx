"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ReceivedRoomSkeleton } from "../skeletons/received-room-skeleton";
import { PageRoutes } from "@/constants/page-routes";
import { formatISODate, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import { ExternalLink, Calendar, Clock, User, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserNoVenueReservations } from "../no-data-mesage/dahsboard-nothing-found";
import { Badge } from "@/components/ui/badge";

export default function UsersVenueReservation() {
  const { data: session } = authClient.useSession();
  const { data: usersVenueReservations, isLoading } =
    api.venue.getAllUpcomingVenueReservationsByUserId.useQuery({
      userId: session?.user.id ?? "",
    });

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
          Your Venue Reservation
        </CardTitle>
        <Button
          className="bg-primary text-white"
          size="sm"
          onClick={handleOpenRequest}
        >
          <ExternalLink className="h-4 w-4 text-white" />
          View All
        </Button>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="space-y-4">
          {isLoading ? (
            <ReceivedRoomSkeleton />
          ) : usersVenueReservations?.length === 0 ? (
            <UserNoVenueReservations />
          ) : (
            usersVenueReservations?.map((reservation) => (
              <div key={reservation.venueReservationId} className="w-full">
                <Card className="gap-2 border-none bg-stone-50 px-4 shadow-none">
                  <div className="space-y-2">
                    <CardHeader className="p-0">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
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

                        <div>
                          {reservation.status === "pending" ? (
                            <Badge className="text- black m-0 border-gray-200 bg-gray-100 text-xs">
                              Pending
                            </Badge>
                          ) : (
                            reservation.status === "approved" && (
                              <Badge className="border-green-200 bg-green-100 text-xs text-green-800">
                                Approved
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {reservation.date
                              ? formatISODate(reservation.date)
                              : "NA"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {`${TIME_MAP[toTimeInt(reservation.startTime)]}`} -{" "}
                            {`${TIME_MAP[toTimeInt(reservation.endTime)]}`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
