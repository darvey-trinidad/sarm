import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, eq } from "@/server/db";
import { pushSubscriptions } from "@/server/db/schema/auth";
import { nanoid } from 'nanoid';
import { generateUUID } from "@/lib/utils";

export const notificationsRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
      p256dh: z.string(),
      auth: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, input.endpoint))
        .get();

      if (existing) {
        return { success: true, subscriptionId: existing.id };
      }

      const subscriptionId = generateUUID();

      await db.insert(pushSubscriptions).values({
        id: subscriptionId,
        userId: ctx.session?.user.id ?? "",
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
        createdAt: new Date(),
      });

      return { success: true, subscriptionId };
    }),

  // Check if THIS specific browser/device subscription exists
  checkSubscription: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const subscription = await db
        .select()
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, input.endpoint))
        .get();

      return !!subscription;
    }),
});