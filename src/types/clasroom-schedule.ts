export type ScheduleSource = "Initial Schedule" | "Vacancy" | "Borrowing" | "Unoccupied";

export interface FinalClassroomSchedule {
  id: string | null;
  classroomId: string | null;
  facultyId: string | null;
  facultyName: string | null;
  subject: string | null;
  section: string | null;
  date: Date;
  startTime: number;
  endTime: number;
  source: ScheduleSource;
}