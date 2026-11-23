"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

const DashboardHeader = () => {
    const pathname = usePathname();
    const { data: session } = useAuth();

    const user = session?.user;
    const role = user?.role;

    const getPageTitle = () => {
        if (pathname === "/admin" || pathname === "/customer") {
            return "Overview";
        }

        const lastSegment = pathname.split("/").filter(Boolean).pop();

        const titles: Record<string, string> = {
            services: "Manage Services",
            appointments:
                role === "admin" ? "Manage Appointments" : "My Appointments",
            users: "Manage Users",
            transactions: "Transactions",
            profile: "My Profile",
        };

        return titles[lastSegment || ""] || "Dashboard";
    };

    const getInitials = (name?: string) =>
        name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div>
                <p className="text-sm text-muted-foreground">
                    {role === "admin" ? "Administration" : "Customer Portal"}
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                    {getPageTitle()}
                </h1>
            </div>

            {user && (
                <div className="flex items-center gap-3">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full border object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {getInitials(user.name)}
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-semibold">
                            {user.name}
                        </p>

                        <p className="text-xs capitalize text-muted-foreground">
                            {role}
                        </p>
                    </div>
                </div>
            )}
        </header>
    );
};

export default DashboardHeader;