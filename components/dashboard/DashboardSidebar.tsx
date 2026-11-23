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

        // Exact match for Add New Service
        if (href === "/admin/services/new") {
            return pathname === href;
        }

        // Manage Services should not be active on Add New Service page
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
            <aside className="sticky top-18 hidden h-[calc(100vh-4.5rem)] w-64 shrink-0 border-r bg-background p-5 lg:block">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <div className="border-b bg-background p-3 lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label={
                        isMobileOpen
                            ? "Close dashboard menu"
                            : "Open dashboard menu"
                    }
                    aria-expanded={isMobileOpen}
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                    {isMobileOpen ? <X size={19} /> : <Menu size={19} />}
                    Dashboard Menu
                </button>

                {isMobileOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/40">
                        <div className="h-full w-72 max-w-[85%] overflow-y-auto bg-background p-5 shadow-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="font-semibold">
                                    SalonBook
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setIsMobileOpen(false)}
                                    aria-label="Close menu"
                                    className="rounded-md p-2 hover:bg-muted"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {sidebarContent}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardSidebar;