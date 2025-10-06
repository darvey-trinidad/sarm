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
import { UserNoResourceBorrowings } from "../no-data-mesage/dahsboard-nothing-found";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
export default function UserResourceBorrowings() {
  const { data: session } = authClient.useSession();
  const { data: upcomingResourceBorrowings, isLoading } =
    api.resource.getUpcomingBorrowingTransactionsByUserId.useQuery({
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
          Your Resource Borrowings
        </CardTitle>
        <Button size="sm" onClick={handleOpenRequest}>
          <ExternalLink className="h-4 w-4 text-white" />
          View All
        </Button>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="space-y-4">
          {isLoading ? (
            <ReceivedRoomSkeleton />
          ) : upcomingResourceBorrowings?.length === 0 ? (
            <UserNoResourceBorrowings />
          ) : (
            upcomingResourceBorrowings?.map((request) => (
              <div key={request.id} className="w-full">
                <Card className="border-border gap-2 border-none bg-stone-50 px-4 shadow-none">
                  <CardHeader className="p-0">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div className="flex items-center gap-2">
                        <div className="border-primary/30 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg border">
                          <Package className="text-primary h-5 w-5" />
                        </div>

                        <CardTitle className="text-md">
                          <div className="flex items-center gap-2">
                            {request.purpose}
                          </div>
                        </CardTitle>
                      </div>

                      <div>
                        {request.status === "pending" ? (
                          <Badge className="text- black m-0 border-gray-200 bg-gray-100 text-xs">
                            Pending
                          </Badge>
                        ) : (
                          request.status === "approved" && (
                            <Badge className="border-green-200 bg-green-100 text-xs text-green-800">
                              Approved
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/*content*/}
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span className="text-gray-600">
                          {request.dateBorrowed
                            ? formatISODate(request.dateBorrowed)
                            : "NA"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        Representative:{" "}
                        <span>{request.representativeBorrower}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="mh-4 w-4" />
                        <span className="text-gray-600">
                          {`${TIME_MAP[toTimeInt(request.startTime)]}`} -{" "}
                          {`${TIME_MAP[toTimeInt(request.endTime)]}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        <span className="w-[250px]">
                          {request.borrowedItems.map((item) => {
                            return item.resourceName + ", ";
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
