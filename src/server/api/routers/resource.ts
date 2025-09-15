import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUUID } from "@/lib/utils";
import { createResource, addResourceQuantity } from "@/lib/api/resource/mutation";
import { createResourceSchema, addResourceQuantitySchema } from "@/server/api-utils/validators/resource";

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
    })
});