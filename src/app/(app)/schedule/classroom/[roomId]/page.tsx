import type { Metadata } from "next";
import BreadcrumbLayout from "@/components/breadcrumb/page-breadcrumb";
import ClassroomCalendarView from "@/components/calendar/classroom-calendar-view";
import { getClassroomWithBuilding } from "@/lib/api/classroom/query";
import { LogbookScheduleButton } from "@/components/classroom-schedule-pdf/logbook-schedule-button";
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
      <ClassroomCalendarView
        classroomId={roomId}
        buildingName={classroom?.buildingName ?? ""}
        classroomName={classroom?.classroomName ?? ""}
        classRoomType={classroom?.classroomType ?? "lecture"}
      />
      <div className="flex justify-end">
        <LogbookScheduleButton classroomId={roomId} />
      </div>
    </div>
  );
}
