import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUUID, toTimeInt } from "@/lib/utils";
import { createResource, addResourceQuantity, createResourceBorrowing, editResourceBorrowing } from "@/lib/api/resource/mutation";
import { createResourceSchema, addResourceQuantitySchema, createResourceBorrowingSchema, getAllAvailableResourcesSchema, EditResourceBorrowingSchema } from "@/server/api-utils/validators/resource";
import { getAllAvailableResources, getAllResourceBorrowings, getAllResources } from "@/lib/api/resource/query";

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
    .query(async ({ input }) => {
      console.log(input);
      const res = await getAllAvailableResources(input.requestedDate, toTimeInt(input.requestedStartTime), toTimeInt(input.requestedEndTime));
      console.log(res);
      return res;
    }),
  createResourceBorrowing: protectedProcedure
    .input(createResourceBorrowingSchema)
    .mutation(({ input }) => {
      const borrowings = input.map((item) => {
        return {
          id: generateUUID(),
          ...item
        };
      });
      return createResourceBorrowing(borrowings);
    }),
  getAllResourceBorrowings: protectedProcedure.query(() => {
    return getAllResourceBorrowings();
  }),
  editResourceBorrowing: protectedProcedure
    .input(EditResourceBorrowingSchema)
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return editResourceBorrowing(id, data);
    }),
});