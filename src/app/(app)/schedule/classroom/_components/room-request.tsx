"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";
import { TIME_OPTIONS } from "@/constants/timeslot";
import { api } from "@/trpc/react";
import { se } from "date-fns/locale";
export default function Header() {
  const { data, isLoading } = api.classroom.getClassroomsPerBuilding.useQuery();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startHour, setSelectedHour] = useState<number | undefined>(undefined);
  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  //hangle submit, change this to api
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      building: selectedBuilding,
      roomType: selectedRoomType,
      date: selectedDate.toLocaleDateString(),
      startTime: `${startHour}`,
      endTime: `${endHour}`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleSubmit} className="flex justify-end space-y-4">
        <DialogTrigger asChild>
          <Button>Request Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Request Room
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Send notification request to other professors for available room.
            </p>
          </DialogHeader>
          {/* Building Selection */}
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Select
              value={selectedBuilding}
              onValueChange={setSelectedBuilding}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a building" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    No buildings available.
                  </SelectItem>
                ) : (
                  data?.map((building) => (
                    <SelectItem
                      key={building.buildingId}
                      value={building.buildingId}
                    >
                      {building.name} - {building.description}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {/* Room Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select
              value={selectedRoomType}
              onValueChange={setSelectedRoomType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {CLASSROOM_TYPE.map((roomType) => (
                  <SelectItem key={roomType} value={roomType}>
                    {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {selectedDate.toLocaleDateString()}
                  </Button>
                </PopoverTrigger>
                <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Select
                    onValueChange={(value) => setSelectedHour(Number(value))}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value.toString()}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Select
                    onValueChange={(value) => setSelectedHour(Number(value))}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value.toString()}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          {/* Submit Button */} {/* Add Sonner here */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-6">
              Send
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
