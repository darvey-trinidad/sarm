import { z } from "zod";
import { CLASSROOM_TYPE } from "@/constants/classroom-type";
import { USABILITY } from "@/constants/usability";

export const createBuildingSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const editBuildingSchema = createBuildingSchema
  .partial()
  .extend({
    id: z.string(),
});

export const createClassroomSchema = z.object({
  buildingId: z.string(),
  name: z.string(),
  type: z.enum(CLASSROOM_TYPE),
  capacity: z.number(),
  usability: z.enum(USABILITY).optional(),
});

export const editClassroomSchema = createClassroomSchema
  .omit({ buildingId: true })
  .partial()
  .extend({
    id: z.string(),
});

export const changeClassroomUsabilitySchema = z.object({
  id: z.string(),
  usability: z.enum(USABILITY),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export type EditBuildingInput = z.infer<typeof editBuildingSchema>;

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type EditClassroomInput = z.infer<typeof editClassroomSchema>;
export type ChangeClassroomUsability = z.infer<typeof changeClassroomUsabilitySchema>;