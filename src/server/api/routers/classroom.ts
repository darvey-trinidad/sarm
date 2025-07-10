import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createBuilding, createClassroom } from "@/lib/api/classroom/mutation";
import { createBuildingSchema, createClassroomSchema } from "@/server/api-utils/validators/classroom";
import { generateUUID } from "@/lib/utils";

export const classroomRouter = createTRPCRouter({
  createBuilding: protectedProcedure
    .input(createBuildingSchema)
    .mutation(({ input }) => {
      return createBuilding({id: generateUUID(), ...input});
  }),
  createClassroom: protectedProcedure
    .input(createClassroomSchema)
    .mutation(({ input }) => {
      return createClassroom({id: generateUUID(), ...input});
  }),
});