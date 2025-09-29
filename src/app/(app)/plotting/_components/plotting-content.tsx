"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useState } from "react";
import PlottingClassroomCalendarView from "@/components/calendar/plotting-calendar-view";
export default function PlottingContent() {
  const { data: buildings } = api.classroom.getClassroomsPerBuilding.useQuery();

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null,
  );

  const classrooms =
    buildings?.find((b) => b.buildingId === selectedBuilding)?.classrooms ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create Classroom Schedule
          </h2>
          <p className="text-muted-foreground">
            Create a schedule for a classroom for the whole semester.
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <Select
          value={selectedBuilding || ""}
          onValueChange={(val) => {
            setSelectedBuilding(val);
            setSelectedClassroom(null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a building" />
          </SelectTrigger>
          <SelectContent>
            {buildings?.map((building) => (
              <SelectItem key={building.buildingId} value={building.buildingId}>
                {building.name} - {building.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedClassroom || ""}
          onValueChange={(val) => setSelectedClassroom(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a classroom" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id}>
                {classroom.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedClassroom ? (
        <PlottingClassroomCalendarView classroomId={selectedClassroom} />
      ) : (
        <div className="text-muted-foreground mt-6 rounded-md border border-dashed p-6 text-center">
          Please select a classroom first to view its schedule.
        </div>
      )}
    </div>
  );
}
