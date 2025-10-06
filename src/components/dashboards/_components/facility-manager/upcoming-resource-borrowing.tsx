"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ReceivedRoomSkeleton } from "../skeletons/received-room-skeleton";
import { Package, Calendar, Clock, User, ExternalLink } from "lucide-react";
import { PageRoutes } from "@/constants/page-routes";
import { formatISODate, toTimeInt } from "@/lib/utils";
import { TIME_MAP } from "@/constants/timeslot";
import { NoUpcomingResourceBorrowing } from "../no-data-mesage/dahsboard-nothing-found";
import { Badge } from "@/components/ui/badge";
export default function UpcomingResourceBorrowing() {
  const { data: upcomingResourceBorrowing, isLoading } =
    api.resource.getUpcomingBorrowingTransactions.useQuery();

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
          Upcoming Resource Borrowing
        </CardTitle>
        <Button size="sm" onClick={handleOpenRequest}>
          <ExternalLink className="h-4 w-4 text-white" />
          View Request
        </Button>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="space-y-4">
          {isLoading ? (
            <ReceivedRoomSkeleton />
          ) : upcomingResourceBorrowing?.length === 0 ? (
            <NoUpcomingResourceBorrowing />
          ) : (
            upcomingResourceBorrowing?.map((request) => (
              <div key={request.id} className="w-full">
                <Card className="gap-2 border-none bg-stone-50 px-4 shadow-none">
                  <div className="space-y-2">
                    <CardHeader className="p-0">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
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

                        <div>
                          <Badge className="border-green-200 bg-green-100 text-xs text-green-800">
                            Approved
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Content */}

                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {request.dateBorrowed
                              ? formatISODate(request.dateBorrowed)
                              : "NA"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4" />

                          <span>
                            {request.borrowedItems.map((item) => {
                              return item.resourceName + ", ";
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {`${TIME_MAP[toTimeInt(request.startTime)]}`} -{" "}
                            {`${TIME_MAP[toTimeInt(request.endTime)]}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          Representative:{" "}
                          <span>{request.representativeBorrower}</span>
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
