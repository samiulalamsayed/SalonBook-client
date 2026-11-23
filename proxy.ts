import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(request: NextRequest) {
    const cookie = request.headers.get("cookie");

    // No session cookie
    if (!cookie) {
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

        if (!response.ok) {
            return NextResponse.redirect(
                new URL("/sign-in", request.url)
            );
        }

        const session = await response.json();

        if (!session?.user) {
            return NextResponse.redirect(
                new URL("/sign-in", request.url)
            );
        }

        const role = session.user.role;

        // Admin route protection
        if (
            request.nextUrl.pathname.startsWith("/admin") &&
            role !== "admin"
        ) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        // Customer route protection
        if (
            request.nextUrl.pathname.startsWith("/customer") &&
            role !== "customer"
        ) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Proxy Authentication Error:", error);

        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
    ],
};