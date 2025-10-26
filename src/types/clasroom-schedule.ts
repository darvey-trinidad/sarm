import type { TimeInt } from "@/constants/timeslot";

export type ScheduleSource = "Initial Schedule" | "Vacancy" | "Borrowing" | "Unoccupied";

export interface FinalClassroomSchedule {
  id: string | null;
  classroomId: string;
  classroomName: string;
  buildingId: string;
  buildingName: string;
  facultyId: string | null;
  facultyName: string | null;
  subject: string | null;
  section: string | null;
  details: string | null;
  date: Date;
  startTime: TimeInt;
  endTime: TimeInt;
  source: ScheduleSource;
}

export interface InitialClassroomSchedule {
  id: string | null;
  classroomId: string;
  facultyId: string | null;
  facultyName: string | null;
  day: number;
  startTime: TimeInt;
  endTime: TimeInt;
  subject: string | null;
  section: string | null;
}

export interface ClassroomBorrowingSchedule {
  date: Date;
  id: string;
  startTime: number;
  endTime: number;
  subject: string | null;
  classroomId: string;
  facultyId: string;
  section: string | null;
  details: string | null;
}