import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type TimeInt } from "@/constants/timeslot";

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

export function isTimeInt(value: number): value is TimeInt {
  return [
    700, 800, 900, 1000, 1100, 1200,
    1300, 1400, 1500, 1600, 1700,
  ].includes(value as TimeInt);
}

export function toTimeInt(value: number | undefined, fallback: TimeInt = 700): TimeInt {
  return value !== undefined && isTimeInt(value) ? value : fallback;
}