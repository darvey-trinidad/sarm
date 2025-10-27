import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TIME_MAP, type TimeInt } from "@/constants/timeslot";
import { TIME_ENTRIES } from "@/constants/timeslot";
import { TIME_KEY_SET } from "@/constants/timeslot";
import { format } from "date-fns";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { ClassroomTypeValues, type ClassroomType } from "@/constants/classroom-type";
import { DepartmentValues, DeptOrOrgValues, type Department } from "@/constants/dept-org";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function newDate(date: Date): Date {
  const shifted = new Date(date);
  shifted.setHours(shifted.getHours() + 8);
  return shifted;
}

export function formatLocalTime(date: Date): string {
  return date.toLocaleString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatISODate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "PPP");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAllTimeDateRange() {
  return {
    startDate: new Date(-8640000000000000),
    endDate: new Date(8640000000000000),
  };
}

export function isTimeInt(value: number): value is TimeInt {
  return TIME_KEY_SET.has(value);
}

export function toTimeInt(
  value: number | undefined,
  fallback: TimeInt = 700,
): TimeInt {
  return value !== undefined && isTimeInt(value) ? value : fallback;
}

export function getCurrentNearestBlock(date: Date): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const currentValue = hours * 100 + (minutes >= 30 ? 50 : 0);

  // ✅ Explicit number type prevents literal-type locking
  let nearest: (typeof TIME_ENTRIES)[number][0] = TIME_ENTRIES[0][0];

  for (const [block] of TIME_ENTRIES) {
    if (currentValue >= block) {
      nearest = block; // 👈 cast fixes the literal issue
    } else {
      break;
    }
  }

  return nearest;
}


export const checkIsPastSchedule = (schedule: FinalClassroomSchedule) => {
  const now = new Date();
  const dateToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const schedDate = new Date(
    schedule.date.getFullYear(),
    schedule.date.getMonth(),
    schedule.date.getDate(),
  );

  const schedIsPast =
    schedDate < dateToday ||
    (schedDate.getTime() === dateToday.getTime() &&
      schedule.endTime <
      now.getHours() * 100 + (now.getMinutes() * 100) / 60);

  return schedIsPast;
}

export const checkRoomAuthority = (dept: string, classroomType: ClassroomType): [authorizedToRoom: boolean, roomDepartment: Department | null] => {
  switch (classroomType) {
    case ClassroomTypeValues.Lecture:
      return [true, null];
    case ClassroomTypeValues.ComputerLaboratory:
      return [dept === DeptOrOrgValues.ITDS, DepartmentValues.ITDS];
    case ClassroomTypeValues.HMLaboratory:
      return [dept === DeptOrOrgValues.HTM, DepartmentValues.HTM];
    case ClassroomTypeValues.BiologyLaboratory:
    case ClassroomTypeValues.ChemistryLaboratory:
    case ClassroomTypeValues.PhysicsLaboratory:
      return [dept === DeptOrOrgValues.GATE, DepartmentValues.GATE];
    case ClassroomTypeValues.ElectronicsLaboratory:
    case ClassroomTypeValues.DraftingLaboratory:
      return [dept === DeptOrOrgValues.BINDTECH, DepartmentValues.BINDTECH];
    default:
      return [false, null];
  }
};

