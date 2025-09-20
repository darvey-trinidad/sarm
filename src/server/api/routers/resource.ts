import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUUID, toTimeInt } from "@/lib/utils";
import { createResource, addResourceQuantity, createResourceBorrowing } from "@/lib/api/resource/mutation";
import { createResourceSchema, addResourceQuantitySchema, createResourceBorrowingSchema, getAllAvailableResourcesSchema } from "@/server/api-utils/validators/resource";
import { getAllAvailableResources, getAllResources } from "@/lib/api/resource/query";

export const resourceRouter = createTRPCRouter({
  createResource: protectedProcedure
    .input(createResourceSchema)
    .mutation(({ input }) => {
      return createResource({ id: generateUUID(), ...input });
    }),
  addResourceQuantity: protectedProcedure
    .input(addResourceQuantitySchema)
    .mutation(({ input }) => {
      return addResourceQuantity(input.id, input.quantity);
    }),
  getAllResources: protectedProcedure.query(() => {
    return getAllResources();
  }),
  getAllAvailableResources: protectedProcedure
    .input(getAllAvailableResourcesSchema)
    .query(({ input }) => {
      console.log(input);
      return getAllAvailableResources(input.requestedDate, toTimeInt(input.requestedStartTime), toTimeInt(input.requestedEndTime));
    }),
  createResourceBorrowing: protectedProcedure
    .input(createResourceBorrowingSchema)
    .mutation(({ input }) => {
      return createResourceBorrowing({ id: generateUUID(), ...input });
    }),
});