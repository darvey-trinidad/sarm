import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createVenue, createVenueReservation } from "@/lib/api/venue/mutation";
import { getAllVenues, getVenueSchedule } from "@/lib/api/venue/query";
import { createVenueSchema, createVenueReservationSchema, getVenueScheduleSchema, createVenueReservationWithBorrowingSchema } from "@/server/api-utils/validators/venue";
import { getAllVenueReservations } from "@/lib/api/venue/query";
import { generateUUID } from "@/lib/utils";
import { createResourceBorrowing } from "@/lib/api/resource/mutation";

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
  createVenueReservationWithBorrowing: protectedProcedure
    .input(createVenueReservationWithBorrowingSchema)
    .mutation(async ({ input }) => {
      const venueReservation = await createVenueReservation({ id: generateUUID(), ...input.venue });

      if (!venueReservation) throw new Error("Could not create venue reservation");

      const borrowings = input.borrowing.map((borrowing) => ({ id: generateUUID(), ...borrowing, venueReservationId: venueReservation.id }));

      const borrowing = createResourceBorrowing(borrowings);
      return { venueReservation, borrowing };
    }),
  getAllVenueReservations: protectedProcedure.query(() => {
    return getAllVenueReservations();
  }),
  getVenueSchedule: protectedProcedure
    .input(getVenueScheduleSchema)
    .query(({ input }) => {
      console.log(input);
      return getVenueSchedule(input.venueId, input.startDate, input.endDate);
    }),
});