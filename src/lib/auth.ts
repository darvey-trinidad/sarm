import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { user } from "@/server/db/schema/auth";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", 
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn: false
    },
    plugins: [nextCookies()] // make sure nextCookies is the last plugin in the array
});