"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { ReservationStatus } from "@/constants/reservation-status";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  FileText,
  Search,
  XCircle,
  Package,
} from "lucide-react";
import { formatLocalTime, formatISODate } from "@/lib/utils";
import LoadingMessage from "@/components/loading-state/loading-message";
import NoReports from "@/components/loading-state/no-reports";
import { authClient } from "@/lib/auth-client";
import { getStatusIconVenue, getStatusColorVenue } from "../icon-status";
import NoReportsuser from "@/components/loading-state/no-reports-user";
export default function VenueReservationUser() {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: venueReservations,
    isLoading,
    refetch: refetchVenuesReservation,
  } = api.venue.getAllVenueReservationsByUserId.useQuery({
    userId: session?.user.id ?? "",
  });

  const { mutate: editStatusMutation } =
    api.venue.editVenueReservationStatus.useMutation();

  const filteredVenueReservations = useMemo(() => {
    if (!venueReservations) return [];

    if (!searchTerm) return venueReservations;

    const searchLower = searchTerm.toLowerCase();
    return venueReservations.filter((reservation) =>
      reservation.purpose.toLowerCase().includes(searchLower),
    );
  }, [venueReservations, searchTerm]);

  const handleCancel = (reservationId: string) => {
    showConfirmation({
      title: "Cancel Venue Reservation",
      description: "Are you sure you want to cancel this reservation?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: reservationId,
              status: ReservationStatus.Canceled,
            },
            {
              onSuccess: () => {
                toast.success("Venue reservation canceled!");
                void refetchVenuesReservation();
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
          <h2 className="text-2xl font-bold">Venue Request</h2>
          <p className="text-muted-foreground">
            Review and manage your venue reservations
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

      {/* Venue Reservations Card */}
      <div className="grid gap-4">
        {!isLoading && filteredVenueReservations.length === 0 ? (
          <NoReportsuser />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          filteredVenueReservations.map((reservation) => (
            <Card key={reservation.venueReservationId}>
              <CardContent className="p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="item-start flex gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:flex-row">
                        <h3 className="text-medium font-semibold text-gray-800">
                          {reservation.purpose}
                        </h3>
                        <div className="flex items-center">
                          <Badge
                            className={`${getStatusColorVenue(reservation.status)} flex items-center gap-1`}
                          >
                            {getStatusIconVenue(reservation.status)}
                            {reservation.status.charAt(0).toUpperCase() +
                              reservation.status.slice(1)}
                          </Badge>
                          {reservation.borrowingTransaction && (
                            <Badge
                              className="ml-2 flex items-center gap-1 border-sky-200 bg-sky-100 text-sky-800"
                              title="This request has a linked resource borrowing"
                            >
                              <Package className="h-3 w-3" />
                              With {
                                reservation.borrowingTransaction.status
                              }{" "}
                              borrowing
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-muted-foreground justitfy-between flex flex-col gap-4 pt-2 lg:flex-row">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{reservation.reserverName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{reservation.venueName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatISODate(reservation.date)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {
                              TIME_MAP[
                              reservation.startTime as keyof typeof TIME_MAP
                              ]
                            }{" "}
                            -{" "}
                            {
                              TIME_MAP[
                              reservation.endTime as keyof typeof TIME_MAP
                              ]
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 md:mt-0">
                    {reservation.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          reservation.fileUrl &&
                          window.open(reservation.fileUrl, "_blank")
                        }
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        View Attachment
                      </Button>
                    )}

                    {reservation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleCancel(reservation.venueReservationId)
                          }
                          className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {reservation.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCancel(reservation.venueReservationId)
                        }
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground border-border border-t pt-3 text-xs">
                  Submitted on {formatISODate(reservation.createdAt)} (
                  {formatLocalTime(reservation.createdAt)})
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
