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
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

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
    if (!calendarRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // Find all scrollable elements and expand them
      const scrollArea = calendarRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      const scrollAreaContainer =
        calendarRef.current.querySelector(".h-\\[75vh\\]");
      const allScrollContainers = calendarRef.current.querySelectorAll(
        '[style*="overflow"]',
      );

      // Store original styles
      const originalStyles = new Map<HTMLElement, {
        height?: string;
        overflow?: string;
        maxHeight?: string;
      }>();

      if (scrollArea instanceof HTMLElement) {
        originalStyles.set(scrollArea, {
          height: scrollArea.style.height,
          overflow: scrollArea.style.overflow,
          maxHeight: scrollArea.style.maxHeight,
        });
        scrollArea.style.height = "auto";
        scrollArea.style.maxHeight = "none";
        scrollArea.style.overflow = "visible";
      }

      if (scrollAreaContainer instanceof HTMLElement) {
        originalStyles.set(scrollAreaContainer, {
          height: scrollAreaContainer.style.height,
          maxHeight: scrollAreaContainer.style.maxHeight,
        });
        scrollAreaContainer.style.height = "auto";
        scrollAreaContainer.style.maxHeight = "none";
      }

      // Expand any other scroll containers
      allScrollContainers.forEach((el) => {
        if (el instanceof HTMLElement && el !== scrollArea) {
          originalStyles.set(el, {
            overflow: el.style.overflow,
            height: el.style.height,
            maxHeight: el.style.maxHeight,
          });
          el.style.overflow = "visible";
          if (el.style.height) el.style.height = "auto";
          if (el.style.maxHeight) el.style.maxHeight = "none";
        }
      });

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture with lower pixelRatio for smaller file size
      const dataUrl = await toPng(calendarRef.current, {
        quality: 0.92,
        pixelRatio: 1.5,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      // Restore all original styles
      originalStyles.forEach((styles, element) => {
        if (styles.height !== undefined) element.style.height = styles.height;
        if (styles.overflow !== undefined) element.style.overflow = styles.overflow;
        if (styles.maxHeight !== undefined) element.style.maxHeight = styles.maxHeight;
      });

      // Create image to get dimensions
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create PDF in portrait mode
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // A4 Portrait dimensions
      const pageWidth = 210; // A4 portrait width in mm
      const pageHeight = 297; // A4 portrait height in mm
      const margin = 10;
      const headerHeight = 20;

      // Add header with building and classroom info
      pdf.setFontSize(16);
      pdf.setFont("", "bold");
      pdf.text(
        `${selectedBuildingName} - ${selectedClassroomName}`,
        pageWidth / 2,
        15,
        { align: "center" },
      );

      pdf.setFontSize(10);
      pdf.setFont("", "normal");
      pdf.text("Weekly Schedule", pageWidth / 2, 22, { align: "center" });

      // Calculate available space for calendar (after header and margins)
      const availableWidth = pageWidth - 2 * margin;
      const availableHeight = pageHeight - headerHeight - 2 * margin;

      // Calculate scaling to fit calendar in available space
      const scaleWidth = availableWidth / img.width;
      const scaleHeight = availableHeight / img.height;
      const scale = Math.min(scaleWidth, scaleHeight); // Use the smaller scale to fit everything

      const finalWidth = img.width * scale;
      const finalHeight = img.height * scale;

      // Center the calendar horizontally if it doesn't fill the width
      const xOffset = margin + (availableWidth - finalWidth) / 2;
      const yOffset = headerHeight + margin;

      // Add the calendar image
      pdf.addImage(
        dataUrl,
        "JPEG", // Use JPEG for better compression
        xOffset,
        yOffset,
        finalWidth,
        finalHeight,
        undefined,
        "FAST",
      );

      // Generate filename
      const filename = `${selectedBuildingName}_${selectedClassroomName}_Schedule.pdf`;

      // Download
      toast.success("PDF generated successfully");
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
