"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    CalendarDays,
    UserRound,
    Scissors,
    Users,
    CreditCard,
    Menu,
    X,
    PlusCircle,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Services", href: "/admin/services", icon: Scissors },
    { name: "Add New Service", href: "/admin/services/new", icon: PlusCircle },
    { name: "Manage Appointments", href: "/admin/appointments", icon: CalendarDays },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "My Profile", href: "/admin/profile", icon: UserRound },
];

const customerLinks = [
    { name: "Overview", href: "/customer", icon: LayoutDashboard },
    { name: "My Appointments", href: "/customer/appointments", icon: CalendarDays },
    { name: "My Profile", href: "/customer/profile", icon: UserRound },
];

const DashboardSidebar = () => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { data: session, isPending } = useAuth();

    const role = session?.user?.role;

    const links =
        role === "admin"
            ? adminLinks
            : role === "customer"
                ? customerLinks
                : [];

    const isActive = (href: string) => {
        if (href === "/admin" || href === "/customer") {
            return pathname === href;
        }

        if (href === "/admin/services/new") {
            return pathname === href;
        }

        if (href === "/admin/services") {
            return (
                pathname === href ||
                (pathname.startsWith(`${href}/`) &&
                    pathname !== "/admin/services/new")
            );
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const sidebarContent = (
        <>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {role === "admin" ? "Administration" : "Customer Panel"}
                </p>

                <h2 className="mt-2 text-xl font-bold">Dashboard</h2>
            </div>

            <nav className="flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive(link.href)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon size={19} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </>
    );

    if (isPending) {
        return (
            <aside className="hidden w-64 shrink-0 border-r bg-background p-5 lg:block">
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </aside>
        );
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 self-stretch border-r bg-background p-5 lg:block">
                {sidebarContent}
            </aside>

            {/* Mobile Dashboard Menu */}
            <div className="px-4 pt-4 lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="Open dashboard menu"
                    aria-expanded={isMobileOpen}
                    className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                >
                    <Menu size={19} />
                    Dashboard
                </button>
            </div>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <aside
                        className="h-full w-72 max-w-[85%] overflow-y-auto bg-background p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <span className="font-semibold">SalonBook</span>

                            <button
                                type="button"
                                onClick={() => setIsMobileOpen(false)}
                                aria-label="Close dashboard menu"
                                className="rounded-md p-2 hover:bg-muted"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
};

export default DashboardSidebar;