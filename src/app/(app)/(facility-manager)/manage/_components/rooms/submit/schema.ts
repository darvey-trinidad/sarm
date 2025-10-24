import { z } from "zod";
import { FLOORS } from "@/constants/floors";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";

export const RoomSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  buildingId: z.string().min(1, { message: "Please select a building" }),
  capacity: z.coerce
    .number({ invalid_type_error: "Capacity must be a number" })
    .min(1, { message: "Capacity must be greater than 0" }),
  floor: z.enum(FLOORS, {
    errorMap: () => ({ message: "Please select a valid floor" }),
  }),
  type: z.enum(CLASSROOM_TYPE, {
    errorMap: () => ({ message: "Please select a valid type" }),
  }),
});
