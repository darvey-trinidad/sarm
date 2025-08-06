import z from "zod";

export const dateSchema = z.date()
  .transform((date) =>
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  );

export const requiredDateSchema = () =>
  z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);

      // return date at 00:00
      if (!isNaN(date.getTime())) return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    return undefined;
  }, z.date());