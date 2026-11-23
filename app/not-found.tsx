"use client";

import Link from "next/link";
import { ArrowLeft, Home, Scissors, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg text-center">

                {/* Icon */}
                <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                    <SearchX className="h-14 w-14 text-primary" />

                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md">
                        <Scissors className="h-5 w-5 text-primary" />
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="mt-8 text-7xl font-extrabold tracking-tight text-primary">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-bold">
                    Page Not Found
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                    Sorry! The page you are looking for doesn't exist,
                    has been moved, or is temporarily unavailable.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                        <Home size={17} />
                        Back to Home
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition hover:bg-muted"
                    >
                        <ArrowLeft size={17} />
                        Go Back
                    </button>

                </div>

                <p className="mt-10 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} SalonBook. All rights reserved.
                </p>

            </div>
        </div>
    );
}