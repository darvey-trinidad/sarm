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
  startTime: z.string().refine(
    (value) => {
      const selectedTime = new Date(
        `${new Date().toISOString().split("T")[0]}T${value}`,
      );
      const currentTime = new Date();
      return selectedTime >= currentTime;
    },
    {
      message: "Please select a start time that is not before the current time",
    },
  ),
  endTime: z.string({
    message: "Please select an end time",
  }),
});
