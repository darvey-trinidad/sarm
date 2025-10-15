import { z } from "zod";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";
import { FLOORS } from "@/constants/floors";
export const classroomSchema = z.object({
  name: z.string().min(1, "Classroom name is required"),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be a positive number"),
  floor: z.enum(FLOORS, {
    errorMap: () => ({ message: "Select a valid floor" }),
  }),
  type: z.enum(CLASSROOM_TYPE, {
    errorMap: () => ({ message: "Select a valid classroom type" }),
  }),
});
