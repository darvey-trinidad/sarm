import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ]
});

export type BetterAuthSession = typeof authClient.$Infer.Session;