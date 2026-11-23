import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const cookie = request.headers.get("cookie");

    const isAuthPage =
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up");

    // No session cookie
    if (!cookie) {
        // Allow unauthenticated users to access Sign In and Sign Up
        if (isAuthPage) {
            return NextResponse.next();
        }

        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    try {
        // Verify Better Auth session with backend
        const response = await fetch(
            `${API_URL}/api/auth/get-session`,
            {
                headers: {
                    cookie,
                },
                cache: "no-store",
            }
        );

        // Invalid or expired session
        if (!response.ok) {
            if (isAuthPage) {
                return NextResponse.next();
            }

            return NextResponse.redirect(
                new URL("/sign-in", request.url)
            );
        }

        const session = await response.json();

        if (!session?.user) {
            if (isAuthPage) {
                return NextResponse.next();
            }

            return NextResponse.redirect(
                new URL("/sign-in", request.url)
            );
        }

        const role = session.user.role;

        // Redirect authenticated users away from Sign In and Sign Up
        if (isAuthPage) {
            if (role === "admin") {
                return NextResponse.redirect(
                    new URL("/admin", request.url)
                );
            }

            if (role === "customer") {
                return NextResponse.redirect(
                    new URL("/customer", request.url)
                );
            }

            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        // Admin route protection
        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(
                new URL(
                    role === "customer" ? "/customer" : "/",
                    request.url
                )
            );
        }

        // Customer route protection
        if (pathname.startsWith("/customer") && role !== "customer") {
            return NextResponse.redirect(
                new URL(
                    role === "admin" ? "/admin" : "/",
                    request.url
                )
            );
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Proxy Authentication Error:", error);

        if (isAuthPage) {
            return NextResponse.next();
        }

        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
        "/sign-in",
        "/sign-up",
    ],
};