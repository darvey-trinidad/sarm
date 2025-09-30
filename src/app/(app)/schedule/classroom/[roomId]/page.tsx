import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ClassroomCalendarView from "@/components/calendar/classroom-calendar-view";
import { getClassroomWithBuilding } from "@/lib/api/classroom/query";
type PageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Room",
};

export default async function RoomSchedule({ params }: PageProps) {
  const { roomId } = await params;
  const classrooms = await getClassroomWithBuilding(roomId);
  const classroom = classrooms[0];
  return (
    <div className="flex w-full flex-col space-y-4">
      <BreadcrumbLayout
        currentPage="Buildings"
        subPage="Classroom"
        parentPage="Schedule"
      />

      <div className="items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <Link href="/schedule/classroom">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {classroom?.buildingName}
            </h1>
            <p className="text-muted-foreground">
              Classroom - {classroom?.classroomName}{" "}
              <strong>({classroom?.classroomType}</strong>)
            </p>
          </div>
        </div>
      </div>
      <ClassroomCalendarView classroomId={roomId} />
    </div>
  );
}
