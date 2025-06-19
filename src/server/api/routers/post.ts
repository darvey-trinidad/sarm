/*
* BOILERPLATE CODE
*/

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { db } from "@/server/db";

export const postRouter = createTRPCRouter({
  pingDb: publicProcedure.query(async () => {
    const result = await db.execute(`SELECT 1 + 1 AS result`);
    return result;
  }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

});
