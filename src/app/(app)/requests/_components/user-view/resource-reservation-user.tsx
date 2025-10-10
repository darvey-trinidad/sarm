"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatLocalTime, formatISODate } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  UserCheck,
  Package,
  FileText,
  Search,
  XCircle,
  Undo2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import LoadingMessage from "@/components/loading-state/loading-message";
import { getStatusColorResource, getStatusIconResource } from "../icon-status";
import NoReportsuser from "@/components/loading-state/no-reports-user";

export default function ResourceReservationUser() {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: ResourceReservation,
    isLoading,
    refetch: refetchResourceReservation,
  } = api.resource.getAllBorrowingTransactionsByUserId.useQuery({
    userId: session?.user.id ?? "",
  });

  const { mutate: editStatusMutation } =
    api.resource.editBorrowingTransaction.useMutation();

  const filteredResourceReservation = useMemo(() => {
    if (!ResourceReservation) return [];

    const searchLower = searchTerm.toLowerCase();
    return ResourceReservation.filter((resource) =>
      resource.purpose.toLowerCase().includes(searchLower),
    );
  }, [ResourceReservation, searchTerm]);

  const handleCancel = (resourceBorrowingId: string) => {
    showConfirmation({
      title: "Cancel Resource Reservation",
      description: "Are you sure you want to cancel this reservation?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: resourceBorrowingId,
              status: "canceled",
            },
            {
              onSuccess: () => {
                toast.success("Resource reservation canceled!");
                void refetchResourceReservation();
                resolve(true);
              },
              onError: (error) => {
                toast.error(error.message);
                resolve(false);
              },
            },
          );
        });
      },
    });
  };

  const handleReturn = (resourceBorrowingId: string) => {
    showConfirmation({
      title: "Return Resource Reservation",
      description: "Are you sure you want to return this reservation?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "default",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: resourceBorrowingId,
              status: "returned",
            },
            {
              onSuccess: () => {
                toast.success("Resource reservation returned!");
                void refetchResourceReservation();
                resolve(true);
              },
              onError: (error) => {
                toast.error(error.message);
                resolve(false);
              },
            },
          );
        });
      },
    });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Resource Request</h2>
          <p className="text-muted-foreground">
            Review and manage your resource reservations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            id="search"
            placeholder="Search by purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-xs pl-10"
          />
        </div>
      </div>

      {/* Resource Reservation Card */}
      <div className="grid gap-4">
        {isLoading && filteredResourceReservation.length === 0 ? (
          <NoReportsuser />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          filteredResourceReservation.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:flex-row">
                        <h3 className="text-medium font-semibold text-gray-800">
                          {resource.purpose}
                        </h3>
                        <div className="flex items-center">
                          <Badge
                            className={`${getStatusColorResource(resource.status)} flex items-center gap-1`}
                          >
                            {getStatusIconResource(resource.status)}
                            {resource.status.charAt(0).toUpperCase() +
                              resource.status.slice(1)}
                          </Badge>
                          {resource.venueReservationId && (
                            <Badge
                              className="ml-2 flex items-center gap-1 border-sky-200 bg-sky-100 text-sky-800"
                              title="This request has a linked venue reservation"
                            >
                              <MapPin className="h-3 w-3" />
                              With {resource.venueReservationStatus} venue
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{resource.borrowerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {resource.dateBorrowed
                              ? formatISODate(resource.dateBorrowed)
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {
                              TIME_MAP[
                              resource.startTime as keyof typeof TIME_MAP
                              ]
                            }{" "}
                            -{" "}
                            {
                              TIME_MAP[
                              resource.endTime as keyof typeof TIME_MAP
                              ]
                            }
                          </span>
                        </div>
                      </div>

                      {resource.borrowedItems.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <h4 className="text-sm font-semibold text-gray-800">
                              Resources Requested:
                            </h4>
                          </div>
                          <ScrollArea className="mt-2 h-30 w-full">
                            <div className="space-y-2">
                              {resource.borrowedItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-md bg-stone-50 p-2"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {item.resourceName}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        × {item.quantity}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                      {item.resourceDescription}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                      {/*representative borrower change the position */}
                      {resource.representativeBorrower && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <h4 className="font-semibold text-gray-800">
                            Representative:
                          </h4>
                          <UserCheck className="h-4 w-4" />
                          <span>{resource.representativeBorrower}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 md:mt-0">
                    {resource.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          resource.fileUrl &&
                          window.open(resource.fileUrl, "_blank")
                        }
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        View Attachment
                      </Button>
                    )}

                    {resource.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCancel(resource.id)}
                          className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {resource.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleCancel(resource.id)}
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Cancel
                      </Button>
                    )}

                    {resource.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleReturn(resource.id)}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Undo2 className="mr-1 h-4 w-4" />
                        Return
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-muted-foreground border-border flex border-t pt-3 text-xs">
                  Submitted on {formatISODate(resource.dateRequested)} {""}(
                  {formatLocalTime(resource.dateRequested)})
                  {resource.dateReturned && (
                    <span>
                      Returned on {formatISODate(resource.dateReturned)} (
                      {formatLocalTime(resource.dateReturned)})
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {ConfirmationDialog}
    </div>
  );
}
