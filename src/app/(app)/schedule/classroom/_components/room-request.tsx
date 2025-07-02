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
export default function Header() {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startHour, setStartHour] = useState("8");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const buildings = [
    { id: "A", name: "Building A", department: "BIT Dept." },
    { id: "B", name: "Building B", department: "ITDS Dept." },
    { id: "C", name: "Building C", department: "GATE Dept." },
    { id: "D", name: "Building D", department: "BA Dept." },
    { id: "E", name: "Building E", department: "New Building" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      building: selectedBuilding,
      roomType: selectedRoomType,
      date: selectedDate.toLocaleDateString(),
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
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
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name} - {building.department}
                  </SelectItem>
                ))}
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
                <SelectItem value="classroom">Classroom</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="conference">Conference Room</SelectItem>
                <SelectItem value="lecture">Lecture Hall</SelectItem>
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
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-16 text-center"
                  />
                  <span>:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={startMinute}
                    onChange={(e) => setStartMinute(e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex w-30 justify-between text-xs text-gray-500">
                <span>Hours</span>
                <span>Minutes</span>
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-16 text-center"
                  />
                  <span>:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={endMinute}
                    onChange={(e) => setEndMinute(e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex w-30 justify-between text-xs text-gray-500">
                <span>Hours</span>
                <span>Minutes</span>
              </div>
            </div>
          </div>
          {/* Submit Button */} {/* Add Sonner here */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-amber-800 px-8 text-white hover:bg-amber-900"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
