"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useState, useRef } from "react";
import PlottingClassroomCalendarView from "@/components/calendar/plotting-calendar-view";
import { generateSchedulePDF } from "./plot/generateSchedulePdf";

export default function PlottingContent() {
  const { data: buildings } = api.classroom.getClassroomsPerBuilding.useQuery();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null,
  );

  const classrooms =
    buildings?.find((b) => b.buildingId === selectedBuilding)?.classrooms ?? [];

  const selectedClassroomName = classrooms.find(
    (c) => c.id === selectedClassroom,
  )?.name;

  const selectedBuildingName = buildings?.find(
    (b) => b.buildingId === selectedBuilding,
  )?.name;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    await generateSchedulePDF({
      calendarRef,
      selectedBuildingName,
      selectedClassroomName,
    });
    setIsGeneratingPDF(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create Classroom Schedule
          </h2>
          <p className="text-muted-foreground">
            Create a schedule for a classroom for the whole semester.
          </p>
        </div>
        {selectedClassroom && (
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex flex-row gap-2">
        <Select
          value={selectedBuilding ?? ""}
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
          value={selectedClassroom ?? ""}
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
        <div ref={calendarRef}>
          <PlottingClassroomCalendarView classroomId={selectedClassroom} />
        </div>
      ) : (
        <div className="text-muted-foreground mt-6 rounded-md border border-dashed p-6 text-center">
          Please select a classroom first to view its schedule.
        </div>
      )}
    </div>
  );
}
