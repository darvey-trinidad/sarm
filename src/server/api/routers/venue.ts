import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue, createVenueReservation } from "@/lib/api/venue/mutation";
import { getAllVenues } from "@/lib/api/venue/query";
import { createVenueSchema, createVenueReservationSchema } from "@/server/api-utils/validators/venue";
import { generateUUID } from "@/lib/utils";

export const venueRouter = createTRPCRouter({
  createVenue: protectedProcedure
    .input(createVenueSchema)
    .mutation(({ input }) => {
      return createVenue({ id: generateUUID(), ...input });
    }),
  getAllVenues: protectedProcedure.query(() => {
    return getAllVenues();
  }),
  createVenueReservation: protectedProcedure
    .input(createVenueReservationSchema)
    .mutation(({ input }) => {
      return createVenueReservation({ id: generateUUID(), ...input });
    }),
});