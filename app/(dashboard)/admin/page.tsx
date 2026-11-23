"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Scissors,
    CalendarDays,
    Clock,
    CheckCircle2,
    CreditCard,
    RefreshCw,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

interface DashboardStats {
    totalCustomers: number;
    totalActiveServices: number;
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    totalSuccessfulPayments: number;
}

interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardStats;
}

const statCards = [
    {
        title: "Total Customers",
        key: "totalCustomers",
        description: "Registered customers",
        icon: Users,
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Active Services",
        key: "totalActiveServices",
        description: "Currently available services",
        icon: Scissors,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Total Appointments",
        key: "totalAppointments",
        description: "All appointment requests",
        icon: CalendarDays,
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        title: "Pending Appointments",
        key: "pendingAppointments",
        description: "Awaiting confirmation",
        icon: Clock,
        color: "bg-amber-100 text-amber-600",
    },
    {
        title: "Confirmed Appointments",
        key: "confirmedAppointments",
        description: "Successfully confirmed",
        icon: CheckCircle2,
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Successful Payments",
        key: "totalSuccessfulPayments",
        description: "Completed transactions",
        icon: CreditCard,
        color: "bg-pink-100 text-pink-600",
    },
] as const;

const AdminDashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            setError("");

            const result: DashboardResponse = await apiFetch(
                "/api/dashboard/admin"
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to load dashboard statistics."
                );
            }

            setStats(result.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard Overview
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Welcome to your admin dashboard. Here's what's happening
                    with your salon.
                </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-36 animate-pulse rounded-xl border bg-background"
                        />
                    ))}
                </div>
            ) : error ? (
                /* Error State */
                <div className="rounded-xl border bg-background p-8 text-center">
                    <p className="font-medium text-destructive">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchDashboardStats}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            ) : (
                /* Statistics Cards */
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.key}
                                className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {card.title}
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold tracking-tight">
                                            {stats?.[card.key]?.toLocaleString(
                                                "en-BD"
                                            ) ?? 0}
                                        </h2>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                                    >
                                        <Icon size={23} />
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;