import type { building } from "@/server/db/schema/classroom";
import { z } from "zod";

export const requestClassroomSchema = z.object({
  building: z.string({
    message: "Please select a building",
  }),
  roomType: z.string({
    message: "Please select a room type",
  }),
  date: z.date({
    message: "Please select a date",
  }),
  startTime: z.string({
    message: "Select start time",
  }),
  endTime: z.string({
    message: "Select end time",
  }),
});
