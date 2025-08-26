import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
