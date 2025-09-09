import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue } from "@/lib/api/venue/mutation";
import { createVenueSchema } from "@/server/api-utils/validators/venue";
import { generateUUID } from "@/lib/utils";

export const venueRouter = createTRPCRouter({
  createVenue: protectedProcedure
    .input(createVenueSchema)
    .mutation(({ input }) => {
      return createVenue({ id: generateUUID(), ...input });
    }),
});