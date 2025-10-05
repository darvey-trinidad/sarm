"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { ReceivedRoomSkeleton } from "../skeletons/received-room-skeleton";
import { Package, Calendar, Clock, User } from "lucide-react";
import { PageRoutes } from "@/constants/page-routes";
import { formatISODate, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
export default function UpcomingResourceBorrowing() {
  const { data: upcomingResourceBorrowing, isLoading } =
    api.resource.getUpcomingBorrowingTransactions.useQuery();
  console.log("DATA:", upcomingResourceBorrowing);

  const handleOpenRequest = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}${PageRoutes.REQUESTS}`,
      "_blank",
    );
  };
  return (
    <Card className="p-6">
      <h3 className="text-xl font-medium">Upcoming Resource Borrowing</h3>

      <div className="space-y-4">
        {isLoading ? (
          <ReceivedRoomSkeleton />
        ) : upcomingResourceBorrowing?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No upcoming resource borrowing.
          </p>
        ) : (
          upcomingResourceBorrowing?.map((request) => (
            <div key={request.id} className="w-full">
              <Card className="border-border gap-2 px-4 transition-shadow hover:shadow-md">
                <div className="space-y-2">
                  <CardHeader className="p-0">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="border-primary/30 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg border">
                          <Package className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-md">
                            {request.purpose}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {request.borrowerName}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:block"
                        onClick={() => handleOpenRequest()}
                      >
                        View Request
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Content */}

                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {request.dateBorrowed
                            ? formatISODate(request.dateBorrowed)
                            : "NA"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {`${TIME_MAP[toTimeInt(request.startTime)]}`} -{" "}
                          {`${TIME_MAP[toTimeInt(request.endTime)]}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-gray-400" />
                        Representative:{" "}
                        <span>{request.representativeBorrower}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <Button
                  variant="outline"
                  className="md:hidden"
                  size="sm"
                  onClick={() => handleOpenRequest()}
                >
                  View Request
                </Button>
              </Card>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
