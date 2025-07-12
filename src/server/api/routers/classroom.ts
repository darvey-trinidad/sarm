import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { changeClassroomUsability, createBuilding, createClassroom } from "@/lib/api/classroom/mutation";
import { createBuildingSchema, createClassroomSchema, changeClassroomUsabilitySchema } from "@/server/api-utils/validators/classroom";
import { generateUUID } from "@/lib/utils";
import { getAllBuildings, getAllClassrooms, getClassroom, getBuilding } from "@/lib/api/classroom/query";

import { z } from "zod";

export const classroomRouter = createTRPCRouter({
  createBuilding: protectedProcedure
    .input(createBuildingSchema)
    .mutation(({ input }) => {
      return createBuilding({id: generateUUID(), ...input});
  }),
  getBuilding: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(({ input }) => {
      return getBuilding(input.id);
  }),
  getAllBuildings: protectedProcedure.query(() => {
    return getAllBuildings();
  }),

  /*
  * Classroom Procedures
  */
  createClassroom: protectedProcedure
    .input(createClassroomSchema)
    .mutation(({ input }) => {
      return createClassroom({id: generateUUID(), ...input});
  }),
  getClassroom: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(({ input }) => {
      return getClassroom(input.id);
  }),
  getAllClassrooms: protectedProcedure.query(() => {
    return getAllClassrooms();
  }),
  changeClassroomUsability: protectedProcedure
    .input(changeClassroomUsabilitySchema)
    .mutation(({ input }) => {
      return changeClassroomUsability(input);
  }),
});