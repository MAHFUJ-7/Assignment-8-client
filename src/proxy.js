import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const hasSessionCookie =
        /(?:^|;\s*)(?:__Secure-)?better-auth[.-]session_token=/.test(cookieHeader);

    if (!hasSessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
        const session = await auth.api.getSession({
            headers: new Headers(request.headers),
        });

        if (!session) {
            return NextResponse.next();
        }
    } catch {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/create_event/:path*",
    "/manage_event/:path*",
    "/joined_events/:path*",
    "/profile/:path*",
  ],
};