"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  cn,
  newDate,
  formatLocalTime,
  formatISODate,
  formatDate,
} from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
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
  UserCheck,
  Package,
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleOff,
  Undo2,
  Loader2,
} from "lucide-react";
import type { BorrowingStatus } from "@/constants/borrowing-status";
import LoadingMessage from "@/components/loading-state/loading-message";
import NoReports from "@/components/loading-state/no-reports";

export default function ResourceReservation() {
  const [selectedResource, setSelectedResource] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [selectedStatus, setSelectedStatus] = useState<BorrowingStatus | "all">(
    "all",
  );

  const { mutate: editStatusMutation } =
    api.resource.editBorrowingTransaction.useMutation();

  const filter = useMemo(
    () => ({
      resource: selectedResource === "all" ? undefined : selectedResource,
      status: selectedStatus === "all" ? undefined : selectedStatus,
      startDate: startDate ? newDate(startDate) : undefined,
      endDate: endDate ? newDate(endDate) : undefined,
    }),
    [selectedResource, selectedStatus, startDate, endDate],
  );

  const {
    data: resources,
    isLoading,
    refetch: refetchResourcesReservations,
  } = api.resource.getAllBorrowingTransactions.useQuery(filter);

  const uniqueResources = useMemo(() => {
    if (!resources) return [];
    const resourceMap = new Map<string, { id: string; name: string }>();
    resources.forEach((request) => {
      request.borrowedItems.forEach((item) => {
        if (!resourceMap.has(item.resourceId)) {
          resourceMap.set(item.resourceId, {
            id: item.resourceId,
            name: item.resourceName,
          });
        }
      });
    });
    return Array.from(resourceMap.values());
  }, [resources]);

  const filteredRequests = useMemo(() => {
    if (!resources) return [];

    return resources.filter((request) => {
      // 1. Resource filter
      if (selectedResource !== "all") {
        const hasResource = request.borrowedItems.some(
          (item) => item.resourceId === selectedResource,
        );
        if (!hasResource) return false;
      }

      // 2. Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          request.borrowerName.toLowerCase().includes(searchLower) ||
          request.purpose.toLowerCase().includes(searchLower) ||
          request.representativeBorrower.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [resources, selectedResource, searchTerm]);

  const handleApprove = (borrowingTransactionId: string) => {
    showConfirmation({
      title: "Approve Resource Reservation",
      description: "Are you sure you want to approve this reservation?",
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: borrowingTransactionId,
              status: "approved",
            },
            {
              onSuccess: () => {
                toast.success("Reservation approved!");
                void refetchResourcesReservations();
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

  const handleCancel = (borrowingTransactionId: string) => {
    showConfirmation({
      title: "Cancel Resource Reservation",
      description: "Are you sure you want to cancel this reservation?",
      confirmText: "Cancel",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: borrowingTransactionId,
              status: "canceled",
            },
            {
              onSuccess: () => {
                toast.success("Reservation canceled!");
                void refetchResourcesReservations();
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

  const handleReject = (borrowingTransactionId: string) => {
    showConfirmation({
      title: "Reject Resource Reservation",
      description: "Are you sure you want to reject this reservation?",
      confirmText: "Reject",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: borrowingTransactionId,
              status: "rejected",
            },
            {
              onSuccess: () => {
                toast.success("Reservation rejected!");
                void refetchResourcesReservations();
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

  const handleReturn = (borrowingTransactionId: string) => {
    showConfirmation({
      title: "Return Resource Reservation",
      description: "Are you sure you want to return this reservation?",
      confirmText: "Return",
      cancelText: "Cancel",
      variant: "default",
      onConfirm: () => {
        return new Promise<boolean>((resolve) => {
          editStatusMutation(
            {
              id: borrowingTransactionId,
              status: "returned",
            },
            {
              onSuccess: () => {
                toast.success("Reservation returned!");
                void refetchResourcesReservations();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "canceled":
        return <CircleOff className="h-4 w-4 text-orange-600" />;
      case "returned":
        return <Undo2 className="h-4 w-4 text-blue-600" />;
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
      case "returned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Resource Request</h2>
          <p className="text-muted-foreground">
            Review and manage resource reservations
          </p>
        </div>

        {/* Filter  Section*/}
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
            <Select
              value={selectedResource}
              onValueChange={setSelectedResource}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {uniqueResources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as BorrowingStatus | "all")
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
                <SelectItem value="returned">
                  <div className="flex items-center gap-2">
                    <Undo2 className="h-4 w-4 text-blue-600" />
                    Returned
                  </div>
                </SelectItem>
                <SelectItem value="rejected">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Rejected
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
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/*Resource Reservations*/}
      <div className="grid gap-4">
        {!isLoading && filteredRequests.length === 0 ? (
          <NoReports />
        ) : isLoading ? (
          <LoadingMessage />
        ) : (
          filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="border-border transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-row gap-2">
                        <h3 className="text-medium font-semibold text-gray-800">
                          {request.purpose}
                        </h3>
                        <div className="flex items-center">
                          <Badge
                            className={`${getStatusColor(request.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                          {request.venueReservationId && (
                            <Badge
                              className="ml-2 flex items-center gap-1 border-sky-200 bg-sky-100 text-sky-800"
                              title="This request has a linked venue reservation"
                            >
                              <MapPin className="h-3 w-3" />
                              With {request.venueReservationStatus} venue
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-muted-foreground flex flex-col gap-4 pt-2 lg:flex-row">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{request.borrowerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {request.dateBorrowed
                              ? formatDate(request.dateBorrowed.toISOString())
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {
                              TIME_MAP[
                                request.startTime as keyof typeof TIME_MAP
                              ]
                            }{" "}
                            -{" "}
                            {TIME_MAP[request.endTime as keyof typeof TIME_MAP]}
                          </span>
                        </div>
                      </div>

                      {request.borrowedItems.length > 0 && (
                        <div className="mt-3 p-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <h4 className="text-medium font-semibold text-gray-800">
                              Resources Requested:
                            </h4>
                          </div>
                          <ScrollArea className="h-32 w-full">
                            <div className="space-y-2">
                              {request.borrowedItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-background flex items-center justify-between rounded border p-2"
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
                      {request.representativeBorrower && (
                        <div className="flex items-center gap-2 text-sm">
                          <h4 className="font-semibold text-gray-800">
                            Representative:
                          </h4>
                          <UserCheck className="h-4 w-4" />
                          <span>{request.representativeBorrower}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    {request.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          request.fileUrl &&
                          window.open(request.fileUrl, "_blank")
                        }
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        View Document
                      </Button>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    )}

                    {request.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Cancel
                      </Button>
                    )}

                    {request.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleReturn(request.id)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Undo2 className="mr-1 h-4 w-4" />
                        Return
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-muted-foreground border-border flex border-t pt-3 text-sm">
                  Submitted on {formatISODate(request.dateRequested)} {""}(
                  {formatLocalTime(request.dateRequested)})
                  {request.dateReturned && (
                    <span>
                      Returned on {formatISODate(request.dateReturned)} (
                      {formatLocalTime(request.dateReturned)})
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
