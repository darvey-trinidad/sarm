import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { PageRoutes } from "@/constants/page-routes";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL(PageRoutes.LOGIN, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/schedule"], // Specify the routes the middleware applies to
};