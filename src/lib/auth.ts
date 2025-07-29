import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { user } from "@/server/db/schema/auth";
import * as schema from "@/server/db/schema/auth";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: true, // true if user sets this in sign up, false if not
            },
            departmentOrOrganization: {
                type: "string",
                required: false,
                input: true,
            },
            name: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    plugins: [nextCookies()],
});