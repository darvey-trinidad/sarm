"use client";
import { api } from "@/trpc/react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TIME_OPTIONS, TIME_MAP, type TimeInt } from "@/constants/timeslot";
import {
  type ClassroomType,
  CLASSROOM_TYPE_OPTIONS,
} from "@/constants/classroom-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Users,
  Filter,
  Building,
  ExternalLink,
  Microscope,
  Book,
  CircleX,
} from "lucide-react";
import ReadySearch from "@/components/loading-state/ready-search";
import LoadingMessage from "@/components/loading-state/loading-message";
import { env } from "@/env";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function FindRoomContent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [startTime, setStartTime] = useState<TimeInt | "">("");
  const [endTime, setEndTime] = useState<TimeInt | "">("");
  const [selectedType, setSelectedType] = useState<ClassroomType | "all">(
    "all",
  );

  // Filters
  const filters = useMemo(
    () => ({
      startTime: String(startTime),
      endTime: String(endTime),
      date: selectedDate?.toISOString(),
      filters: {
        type: selectedType === "all" ? undefined : selectedType,
      },
    }),
    [selectedDate, selectedType, startTime, endTime],
  );

  const shouldFetch = Boolean(startTime && endTime && selectedDate);

  // Query
  const { data: availableClassrooms, isLoading } =
    api.classroomSchedule.getAvailableClassrooms.useQuery(filters, {
      enabled: shouldFetch,
    });

  const totalClassrooms = useMemo(() => {
    if (!availableClassrooms) return 0;
    return availableClassrooms.reduce(
      (total, building) => total + building.classrooms.length,
      0,
    );
  }, [availableClassrooms]);

  const handleOpenClassroom = (buildingId: string) => {
    window.open(
      `${env.NEXT_PUBLIC_APP_URL}/schedule/classroom/${buildingId}`,
      "_blank",
    );
  };

  const getTypeColor = (type: ClassroomType) => {
    switch (type) {
      case "lecture":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "laboratory":
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getTypeIcon = (type: ClassroomType) => {
    switch (type) {
      case "lecture":
        return <Book className="h-4 w-4 text-yellow-600" />;
      case "laboratory":
        return <Microscope className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Find Available Classroom</h2>
        <p className="text-muted-foreground">
          Search for available classrooms based on your schedule
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || date < new Date("1900-01-01");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <Select
          value={startTime ? startTime.toString() : ""}
          onValueChange={(value) =>
            setStartTime(value ? (Number(value) as TimeInt) : "")
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((time) => (
              <SelectItem key={time.value} value={time.value.toString()}>
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* End Time */}
        <Select
          value={endTime ? endTime.toString() : ""}
          onValueChange={(value) =>
            setEndTime(value ? (Number(value) as TimeInt) : "")
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((time) => (
              <SelectItem key={time.value} value={time.value.toString()}>
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select
          value={selectedType}
          onValueChange={(value) =>
            setSelectedType(value as ClassroomType | "all")
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classroom Types</SelectItem>
            {CLASSROOM_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  {getTypeIcon(type.value)} {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {(startTime || endTime || selectedType !== "all" || selectedDate) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStartTime("");
            setEndTime("");
            setSelectedType("all");
            setSelectedDate(undefined);
          }}
        >
          <CircleX className="mr-1 h-4 w-4" /> Clear Filters
        </Button>
      )}

      {/* Classroom List */}
      <div className="lg:grid-row-4 grid gap-4">
        {!shouldFetch ? (
          <ReadySearch />
        ) : isLoading ? (
          <LoadingMessage />
        ) : availableClassrooms && totalClassrooms > 0 ? (
          <div className="space-y-6">
            {availableClassrooms.map((building) => (
              <div key={building.buildingId}>
                <Card
                  key={building.buildingId}
                  className="border-none shadow-none"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building className="h-5 w-5" />
                        {building.buildingName}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {building.classrooms.length} available
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {building.classrooms.map((classroom) => (
                        <Card
                          key={classroom.classroomId}
                          className="border-border transition-shadow hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <h3 className="text-foreground text-lg font-semibold">
                                  Room {classroom.classroomName}
                                </h3>
                                <Badge
                                  className={`${getTypeColor(
                                    classroom.type as ClassroomType,
                                  )} flex items-center gap-1`}
                                >
                                  {getTypeIcon(classroom.type as ClassroomType)}
                                  {classroom.type.charAt(0).toUpperCase() +
                                    classroom.type.slice(1)}
                                </Badge>
                              </div>

                              {/* Details */}
                              <div className="text-muted-foreground space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    Capacity: {classroom.capacity} people
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>Floor: {classroom.floor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Available:{" "}
                                    {startTime
                                      ? TIME_MAP[startTime as TimeInt]
                                      : "--"}{" "}
                                    -{" "}
                                    {endTime
                                      ? TIME_MAP[endTime as TimeInt]
                                      : "--"}
                                  </span>
                                </div>
                              </div>

                              {/* Action */}
                              <div className="border-border border-t pt-2">
                                <Button
                                  className="w-full"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenClassroom(classroom.classroomId)
                                  }
                                >
                                  <ExternalLink className="mr-1 h-4 w-4" /> Open
                                  Classroom
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            No classrooms available for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
