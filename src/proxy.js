import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
     "/productDetails/:path*",
    "/product/:path*",
    "/myProfile/:path*",
    "/profile/:path*",
    
   ], // Specify the routes the middleware applies to
};