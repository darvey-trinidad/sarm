"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn, newDate, formatLocalTime, formatISODate } from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import {
  RESERVATION_STATUS_OPTIONS,
  ReservationStatus,
} from "@/constants/reservation-status";
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
  Clock,
  MapPin,
  User,
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import LoadingMessage from "@/components/loading-state/loading-message";
import NoReports from "@/components/loading-state/no-reports";
import { getStatusColorVenue, getStatusIconVenue } from "../icon-status";

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
    api.venue.editVenueReservationStatus.useMutation();

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
    const venueMap = new Map<string, { id: string; name: string | null }>();
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
        (reservation.reserverName?.toLowerCase().includes(searchLower) ??
          false) ||
        reservation.purpose.toLowerCase().includes(searchLower) ||
        (reservation.venueName?.toLowerCase().includes(searchLower) ?? false),
    );
  }, [venues, searchTerm]);

  const handleApprove = (reservationId: string) => {
    showConfirmation({
      title: "Approve Venue Reservation",
      description: "Are you sure you want to approve this reservation?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: reservationId,
              status: ReservationStatus.Approved,
            },
            {
              onSuccess: () => {
                toast.success("Venue reservation approved!");
                void refetchVenueReservations();
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

  const handleReject = (reservationId: string) => {
    showConfirmation({
      title: "Reject Venue Reservation",
      description: "Are you sure you want to reject this reservation?",
      confirmText: "Confirm",
      cancelText: " Cancel",
      variant: "destructive",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: reservationId,
              status: ReservationStatus.Rejected,
            },
            {
              onSuccess: () => {
                toast.success("Venue reservation rejected!");
                void refetchVenueReservations();
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
                void refetchVenueReservations();
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
                {RESERVATION_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
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
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Reservation Lists */}
      <div className="grid gap-4">
        {!isLoading && filteredReservations.length === 0 ? (
          <NoReports />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          filteredReservations.map((reservation) => (
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
                        View Document
                      </Button>
                    )}

                    {reservation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleReject(reservation.venueReservationId)
                          }
                          className="bg-red-600 text-white hover:bg-red-700"
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
