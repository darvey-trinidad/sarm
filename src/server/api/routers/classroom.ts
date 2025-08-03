import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { changeClassroomUsability, createBuilding, createClassroom, deleteBuilding, deleteClassroom, editBuilding, editClassroom } from "@/lib/api/classroom/mutation";
import { createBuildingSchema, createClassroomSchema, changeClassroomUsabilitySchema, editBuildingSchema, editClassroomSchema } from "@/server/api-utils/validators/classroom";
import { generateUUID } from "@/lib/utils";
import { getAllBuildings, getAllClassrooms, getClassroom, getBuilding, getClassroomsPerBuilding } from "@/lib/api/classroom/query";

import { z } from "zod";

export const classroomRouter = createTRPCRouter({
  createBuilding: protectedProcedure
    .input(createBuildingSchema)
    .mutation(({ input, ctx }) => {
      return createBuilding({ id: generateUUID(), ...input });
    }),
  getBuilding: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getBuilding(input.id);
    }),
  getAllBuildings: protectedProcedure.query(() => {
    return getAllBuildings();
  }),
  editBuilding: protectedProcedure
    .input(editBuildingSchema)
    .mutation(({ input }) => {
      return editBuilding(input);
    }),
  deleteBuilding: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return deleteBuilding(input.id);
    }),
  /*
  * Classroom Procedures
  */
  createClassroom: protectedProcedure
    .input(createClassroomSchema)
    .mutation(({ input }) => {
      return createClassroom({ id: generateUUID(), ...input });
    }),
  getClassroom: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getClassroom(input.id);
    }),
  getAllClassrooms: protectedProcedure.query(() => {
    return getAllClassrooms();
  }),
  getClassroomsPerBuilding: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.session);
    return getClassroomsPerBuilding();
  }),
  editClassroom: protectedProcedure
    .input(editClassroomSchema)
    .mutation(({ input }) => {
      return editClassroom(input);
    }),
  changeClassroomUsability: protectedProcedure
    .input(changeClassroomUsabilitySchema)
    .mutation(({ input }) => {
      return changeClassroomUsability(input);
    }),
  deleteClassroom: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return deleteClassroom(input.id);
    }),
});