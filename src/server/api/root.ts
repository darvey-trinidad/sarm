import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { classroomRouter } from "@/server/api/routers/classroom";
import { classroomScheduleRouter } from "@/server/api/routers/classroom-schedule";
import { venueRouter } from "@/server/api/routers/venue";
import { authRouter } from "@/server/api/routers/auth";
import { resourceRouter } from "@/server/api/routers/resource";
import { facilityIssueRouter } from "@/server/api/routers/facility-issue";
import { auth } from "@/lib/auth";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  classroom: classroomRouter,
  classroomSchedule: classroomScheduleRouter,
  venue: venueRouter,
  resource: resourceRouter,
  facilityIssue: facilityIssueRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
