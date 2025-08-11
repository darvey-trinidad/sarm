import { building } from "@/server/db/schema/classroom";
import { z } from "zod";

export const PlottingSchema = z.object({
  courseCode: z.string({
    message: "Please enter a course code",
  }),
  proffesor: z.string({
    message: "Please enter the proffesor's name",
  }),
  section: z.string({
    message: "Please enter section",
  }),
  building: z.string({
    message: "Please select a building",
  }),
  roomType: z.string({
    message: "Please select a room type",
  }),
  startTime: z.string({
    message: "Select start time",
  }),
  endTime: z.string({
    message: "Select end time",
  }),
  days: z.array(z.string()).refine((days) => days.length > 0, {
    message: "Please select at least one day of the week",
  }),
});
