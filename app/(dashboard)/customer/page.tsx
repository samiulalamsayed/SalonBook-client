"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    CalendarCheck,
    RefreshCw,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

interface Appointment {
    _id: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "unpaid" | "paid";
}

interface AppointmentResponse {
    success: boolean;
    total: number;
    data: Appointment[];
}

const CustomerDashboardPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                setError("");

                const result: AppointmentResponse = await apiFetch(
                    "/api/appointments/my-appointments"
                );

                setAppointments(result.data || []);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load appointments."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const stats = [
        {
            title: "Total Appointment Requests",
            value: appointments.length,
            icon: CalendarDays,
            description: "All your appointment requests",
        },
        {
            title: "Pending Appointments",
            value: appointments.filter(
                (item) => item.status === "pending"
            ).length,
            icon: Clock,
            description: "Waiting for confirmation",
        },
        {
            title: "Confirmed Appointments",
            value: appointments.filter(
                (item) => item.status === "confirmed"
            ).length,
            icon: CheckCircle2,
            description: "Your confirmed appointments",
        },
        {
            title: "Cancelled Appointments",
            value: appointments.filter(
                (item) => item.status === "cancelled"
            ).length,
            icon: XCircle,
            description: "Cancelled appointment requests",
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-7 w-48 animate-pulse rounded bg-muted" />

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="h-36 animate-pulse rounded-xl border bg-background"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-background p-6 text-center">
                <p className="font-medium text-destructive">{error}</p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Welcome Section */}
            <div>
                <h2 className="text-xl font-bold">
                    Welcome to Your Dashboard!
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Track your appointments and manage your salon bookings.
                </p>
            </div>

            {/* Statistics */}
            <section>
                <div className="mb-5">
                    <h3 className="text-lg font-semibold">
                        Appointment Overview
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        A summary of all your appointment requests.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon size={21} />
                                    </div>

                                    <span className="text-3xl font-bold">
                                        {item.value}
                                    </span>
                                </div>

                                <h4 className="mt-5 text-sm font-semibold">
                                    {item.title}
                                </h4>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Appointment Summary */}
            <section className="rounded-xl border bg-background p-6">
                <div className="flex items-center gap-3">
                    <CalendarCheck className="text-primary" size={22} />

                    <div>
                        <h3 className="font-semibold">
                            Appointment Summary
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            You have {appointments.length} total appointment requests.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerDashboardPage;