import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { betterFetch } from '@better-fetch/fetch'

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Fetch session
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    // If no session, redirect to signin for protected routes
    if (!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If user has no role and not on onboarding page, redirect to onboarding
    if (session.user.role === "user" && pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // If user has a role and is on onboarding, redirect to appropriate dashboard
    if (session.user.role && pathname === "/onboarding") {
        if (session.user.role === "advertiser") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else if (session.user.role === "clipper") {
            return NextResponse.redirect(new URL("/dashboard/clipper", request.url));
        }
    }

    // Protect advertiser dashboard - only advertisers can access
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/clipper")) {
        if (session.user.role !== "advertiser") {
            return NextResponse.redirect(new URL("/dashboard/clipper", request.url));
        }
    }

    // Protect clipper dashboard - only clippers can access
    if (pathname.startsWith("/dashboard/clipper")) {
        if (session.user.role !== "clipper") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match all dashboard routes and onboarding
    matcher: ['/dashboard/:path*', '/onboarding'],
}
