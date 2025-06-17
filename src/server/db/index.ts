import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
console.log("ENV DB1:", env.DATABASE_URL);

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

console.log("ENV DB2:", env.DATABASE_URL);

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, { ssl: 'require' });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
console.log("ENV DB3:", env.DATABASE_URL);