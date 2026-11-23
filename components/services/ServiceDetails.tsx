"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Tag,
    CalendarDays,
    Loader2,
    AlertCircle,
} from "lucide-react";

import AppointmentBookingForm from "./AppointmentBookingForm";

interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: string;
}

interface ServiceDetailsProps {
    serviceId: string;
}

export default function ServiceDetails({
    serviceId,
}: ServiceDetailsProps) {

    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!serviceId) return;

        const fetchService = async () => {
            try {
                setIsLoading(true);
                setError("");

                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const response = await fetch(
                    `${API_URL}/api/services/${serviceId}`,
                    { cache: "no-store" }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load service details."
                    );
                }

                setService(result.data);

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

        fetchService();
    }, [serviceId]);

    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-sm text-muted-foreground">
                    Loading service details...
                </p>
            </div>
        );
    }

    // Error State
    if (error || !service) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <AlertCircle size={42} className="mb-4 text-destructive" />

                <h2 className="text-2xl font-semibold">
                    Service Not Found
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {error || "The requested service could not be found."}
                </p>

                <Link
                    href="/services"
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                    <ArrowLeft size={17} />
                    Browse Services
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">

            {/* Breadcrumb */}
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft size={17} />
                    Back to Services
                </Link>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">

                    {/* Service Information */}
                    <div className="space-y-7 lg:col-span-3">

                        {/* Service Image */}
                        <div className="overflow-hidden rounded-2xl border bg-muted">
                            <img
                                src={service.image}
                                alt={service.name}
                                className="h-[280px] w-full object-cover sm:h-[420px]"
                            />
                        </div>

                        {/* Service Details */}
                        <div>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {service.category}
                            </span>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                {service.name}
                            </h1>

                            <p className="mt-4 leading-7 text-muted-foreground">
                                {service.description}
                            </p>
                        </div>

                        {/* Price and Duration */}
                        <div className="grid grid-cols-2 gap-4">

                            <div className="rounded-xl border bg-card p-5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Tag size={18} />
                                    Service Price
                                </div>

                                <p className="mt-3 text-2xl font-bold text-primary">
                                    ৳{service.price.toLocaleString("en-BD")}
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card p-5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={18} />
                                    Duration
                                </div>

                                <p className="mt-3 text-2xl font-bold">
                                    {service.duration} Minutes
                                </p>
                            </div>

                        </div>

                        {/* Booking Information */}
                        <div className="rounded-xl border bg-muted/30 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <CalendarDays size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Book Your Appointment
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Choose your preferred date and time.
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                                <li>• Submit your appointment request.</li>
                                <li>• Wait for admin confirmation.</li>
                                <li>• Pay online after confirmation.</li>
                            </ul>
                        </div>

                    </div>

                    {/* Appointment Booking Form */}
                    <div className="lg:sticky lg:top-24 lg:col-span-2">
                        <AppointmentBookingForm serviceId={service._id} />
                    </div>

                </div>
            </div>
        </main>
    );
}