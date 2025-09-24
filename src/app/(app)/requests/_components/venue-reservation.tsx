"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { cn, newDate } from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { ReservationStatus } from "@/constants/reservation-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  CircleX,
  Clock,
  MapPin,
  User,
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleOff,
  Package,
} from "lucide-react";

// Helper function to format time
const formatTime = (time: number) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function VenueReservation() {
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<
    ReservationStatus | "all"
  >("all");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { mutate: editStatusMutation } =
    api.venue.editVenueReservationAndBorrowingStatus.useMutation();

  const filters = useMemo(
    () => ({
      venueId: selectedVenue === "all" ? undefined : selectedVenue,
      status: selectedStatus === "all" ? undefined : selectedStatus,
      startDate: startDate
        ? newDate(startDate).toISOString().split("T")[0]
        : undefined,
      endDate: endDate
        ? newDate(endDate).toISOString().split("T")[0]
        : undefined,
    }),
    [selectedVenue, selectedStatus, startDate, endDate],
  );

  const {
    data: venues,
    isLoading,
    refetch: refetchVenueReservations,
  } = api.venue.getAllVenueReservations.useQuery(filters);

  const uniqueVenues = useMemo(() => {
    if (!venues) return [];
    const venueMap = new Map();
    venues.forEach((reservation) => {
      if (!venueMap.has(reservation.venueId)) {
        venueMap.set(reservation.venueId, {
          id: reservation.venueId,
          name: reservation.venueName,
        });
      }
    });
    return Array.from(venueMap.values());
  }, [venues]);
  const filteredReservations = useMemo(() => {
    if (!venues) return [];

    if (!searchTerm) return venues;

    const searchLower = searchTerm.toLowerCase();
    return venues.filter(
      (reservation) =>
        reservation.reserverName?.toLowerCase().includes(searchLower) ||
        reservation.purpose.toLowerCase().includes(searchLower) ||
        reservation.venueName?.toLowerCase().includes(searchLower),
    );
  }, [venues, searchTerm]);

  const handleApprove = (reservationId: string) => {
    showConfirmation({
      title: "Approve Venue Reservation",
      description: "Are you sure you want to approve this reservation?",
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        await editStatusMutation(
          {
            id: reservationId,
            reservationStatus: "approved",
            borrowingStatus: "approved",
          },
          {
            onSuccess: () => {
              toast.success("Reservation approved!");
              refetchVenueReservations();
            },
            onError: () => {
              toast.error("Failed to approve reservation!");
            },
          },
        );
      },
    });
  };

  const handleReject = (reservationId: string) => {
    showConfirmation({
      title: "Reject Venue Reservation",
      description: "Are you sure you want to reject this reservation?",
      confirmText: "Reject",
      cancelText: " Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await editStatusMutation(
          {
            id: reservationId,
            reservationStatus: "rejected",
            borrowingStatus: "rejected",
          },
          {
            onSuccess: () => {
              toast.success("Reservation rejected!");
              refetchVenueReservations();
            },
            onError: () => {
              toast.error("Failed to reject reservation!");
            },
          },
        );
      },
    });
  };

  const handleCancel = (reservationId: string) => {
    showConfirmation({
      title: "Cancel Venue Reservation",
      description: "Are you sure you want to cancel this reservation?",
      confirmText: "Cancel",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await editStatusMutation(
          {
            id: reservationId,
            reservationStatus: "canceled",
            borrowingStatus: "canceled",
          },
          {
            onSuccess: () => {
              toast.success("Reservation canceled!");
              refetchVenueReservations();
            },
            onError: () => {
              toast.error("Failed to cancel reservation!");
            },
          },
        );
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "canceled":
        return <CircleOff className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "canceled":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Venue Request</h2>
          <p className="text-muted-foreground">
            Review and manage venue reservations
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-row items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                id="search"
                placeholder="Search by name, purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Venues</SelectItem>
                {uniqueVenues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as ReservationStatus | "all")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="approved">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Approved
                  </div>
                </SelectItem>
                <SelectItem value="rejected">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Rejected
                  </div>
                </SelectItem>
                <SelectItem value="canceled">
                  <div className="flex items-center gap-2">
                    <CircleOff className="h-4 w-4 text-orange-600" />
                    Canceled
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ?? undefined}
                  onSelect={setStartDate}
                  captionLayout="dropdown"
                  disabled={(date) => date < new Date("1900-01-01")}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ?? undefined}
                  onSelect={setEndDate}
                  captionLayout="dropdown"
                  disabled={(date) =>
                    date < new Date("1900-01-01") ||
                    (startDate && date < startDate) ||
                    !!(
                      startDate &&
                      endDate &&
                      date >= startDate &&
                      date <= endDate
                    )
                  }
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedVenue !== "all" || startDate || endDate || searchTerm) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedVenue("all");
              setStartDate(undefined);
              setEndDate(undefined);
              setSearchTerm("");
            }}
            className="mt-2"
          >
            <CircleX /> Clear Filters
          </Button>
        )}
      </div>

      {/* Reservation Lists */}
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground text-lg font-semibold">
                  No reservations found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => (
            <Card
              key={reservation.venueReservationId}
              className="border-border transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="item-start flex gap-4">
                    <div className="flex-1">
                      <div className="flex flex-row gap-2">
                        <h3 className="text-medium font-semibold text-gray-800">
                          {reservation.purpose}
                        </h3>
                        <Badge
                          className={`${getStatusColor(reservation.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(reservation.status)}
                          {reservation.status.charAt(0).toUpperCase() +
                            reservation.status.slice(1)}
                        </Badge>
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
                          <span>
                            {formatDate(reservation.date.toISOString())}
                          </span>
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

                      {reservation.borrowingTransaction &&
                        reservation.borrowingTransaction.itemsBorrowed.length >
                          0 && (
                          <div className="mt-3 p-3">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              <h4 className="text-medium font-semibold text-gray-800">
                                Resources Requested:
                              </h4>
                            </div>
                            <ScrollArea className="h-32 w-full">
                              <div className="space-y-2">
                                {reservation.borrowingTransaction.itemsBorrowed.map(
                                  (item) => (
                                    <div
                                      key={item.id}
                                      className="bg-background flex items-center justify-between rounded border p-2"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">
                                            {item.name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            × {item.quantity}
                                          </Badge>
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
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
                        View Document
                      </Button>
                    )}

                    {reservation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleReject(reservation.venueReservationId)
                          }
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApprove(reservation.venueReservationId)
                          }
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
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
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground border-border border-t pt-3 text-sm">
                  Submitted on {formatDate(reservation.createdAt.toISOString())}{" "}
                  ( {reservation.createdAt.toLocaleTimeString()})
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
