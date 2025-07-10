import { z } from "zod";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";
import { USABILITY } from "@/constants/usability";
import { type Building } from "@/server/db/types/classroom";

export const createBuildingSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export const createClassroomSchema = z.object({
  buildingId: z.string(),
  name: z.string(),
  type: z.enum(CLASSROOM_TYPE),
  capacity: z.number(),
  usability: z.enum(USABILITY).optional(),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;