"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    Clock,
    ArrowRight,
    RefreshCw,
    CalendarX,
    X,
    CreditCard,
    Search,
    ArrowUpDown,
} from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import AppointmentDetailsModal from "@/components/dashboard/AppointmentDetailsModal";

interface Service {
    _id: string;
    name: string;
    category: string;
    price: number;
    duration: number;
    image: string;
}

interface Appointment {
    _id: string;
    serviceId: Service | null;
    appointmentDate: string;
    appointmentTime: string;
    phoneNumber?: string;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "unpaid" | "paid";
    message?: string;
    createdAt: string;
}

interface AppointmentResponse {
    success: boolean;
    total: number;
    data: Appointment[];
}

interface CheckoutResponse {
    success: boolean;
    message: string;
    data: {
        checkoutUrl: string;
        sessionId: string;
    };
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
    };

    return styles[status] || "bg-muted text-muted-foreground";
};

const getPaymentStyle = (status: string) => {
    return status === "paid"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700";
};

const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [payingId, setPayingId] = useState<string | null>(null);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<
        string | null
    >(null);

    const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] =
        useState<Appointment | null>(null);

    // Fetch Appointments
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

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Cancel Appointment
    const handleCancelAppointment = async () => {
        if (!selectedAppointmentId) return;

        try {
            setCancellingId(selectedAppointmentId);

            const result = await apiFetch(
                `/api/appointments/${selectedAppointmentId}/cancel`,
                {
                    method: "PATCH",
                }
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to cancel appointment."
                );
            }

            setAppointments((previous) =>
                previous.map((appointment) =>
                    appointment._id === selectedAppointmentId
                        ? { ...appointment, status: "cancelled" }
                        : appointment
                )
            );

            toast.success("Appointment cancelled successfully!");

            setSelectedAppointmentId(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel appointment."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Pay Now
    const handlePayNow = async (appointmentId: string) => {
        try {
            setPayingId(appointmentId);

            const result: CheckoutResponse = await apiFetch(
                "/api/payments/create-checkout-session",
                {
                    method: "POST",
                    body: JSON.stringify({ appointmentId }),
                }
            );

            if (!result.success || !result.data?.checkoutUrl) {
                throw new Error(
                    result.message || "Failed to create checkout session."
                );
            }

            // Redirect to Stripe Checkout
            window.location.href = result.data.checkoutUrl;
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to process payment."
            );

            setPayingId(null);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="h-8 w-52 animate-pulse rounded bg-muted" />

                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-48 animate-pulse rounded-xl border bg-background"
                    />
                ))}
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="rounded-xl border bg-background p-8 text-center">
                <p className="font-medium text-destructive">{error}</p>

                <button
                    type="button"
                    onClick={fetchAppointments}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">
                        My Appointments
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and track all your salon appointments.
                    </p>
                </div>

                <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {appointments.length} Appointments
                </span>
            </div>

            {/* Empty State */}
            {appointments.length === 0 ? (
                <div className="rounded-xl border bg-background px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <CalendarX
                            size={28}
                            className="text-muted-foreground"
                        />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                        No Appointments Yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                        You haven't booked any salon services yet.
                        Explore our services and book your first appointment.
                    </p>

                    <Link
                        href="/services"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                        Browse Services
                        <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                /* Appointment List */
                <div className="space-y-5">
                    {appointments.map((appointment) => (
                        <article
                            key={appointment._id}
                            className="overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row">
                                {/* Service Image */}
                                <div className="relative h-48 w-full shrink-0 bg-muted sm:h-auto sm:w-48">
                                    {appointment.serviceId?.image ? (
                                        <Image
                                            src={appointment.serviceId.image}
                                            alt={appointment.serviceId.name}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 100vw, 192px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Appointment Information */}
                                <div className="min-w-0 flex-1 p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-primary">
                                                {appointment.serviceId?.category}
                                            </p>

                                            <h3 className="mt-1 text-lg font-bold">
                                                {appointment.serviceId?.name ||
                                                    "Service Unavailable"}
                                            </h3>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays
                                                size={17}
                                                className="text-muted-foreground"
                                            />

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Appointment Date
                                                </p>

                                                <p className="text-sm font-medium">
                                                    {formatDate(
                                                        appointment.appointmentDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock
                                                size={17}
                                                className="text-muted-foreground"
                                            />

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Appointment Time
                                                </p>

                                                <p className="text-sm font-medium">
                                                    {appointment.appointmentTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Service Price
                                            </p>

                                            <p className="text-sm font-bold">
                                                ৳
                                                {appointment.totalAmount.toLocaleString(
                                                    "en-BD"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Payment
                                                </p>

                                                <span
                                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStyle(
                                                        appointment.paymentStatus
                                                    )}`}
                                                >
                                                    {appointment.paymentStatus}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Request Date
                                                </p>

                                                <p className="mt-1 text-xs font-medium">
                                                    {formatDate(
                                                        appointment.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Cancel Button */}
                                            {appointment.status === "pending" && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        cancellingId ===
                                                        appointment._id
                                                    }
                                                    onClick={() =>
                                                        setSelectedAppointmentId(
                                                            appointment._id
                                                        )
                                                    }
                                                    className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            )}

                                            {/* Pay Now Button */}
                                            {appointment.status === "confirmed" &&
                                                appointment.paymentStatus ===
                                                "unpaid" && (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            payingId !== null
                                                        }
                                                        onClick={() =>
                                                            handlePayNow(
                                                                appointment._id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CreditCard size={16} />

                                                        {payingId ===
                                                            appointment._id
                                                            ? "Redirecting..."
                                                            : "Pay Now"}
                                                    </button>
                                                )}

                                            {/* View Details */}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedAppointmentForDetails(appointment)}
                                                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                            >
                                                View Details
                                                <ArrowRight size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {selectedAppointmentId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                Cancel Appointment?
                            </h3>

                            <button
                                type="button"
                                disabled={cancellingId !== null}
                                onClick={() =>
                                    setSelectedAppointmentId(null)
                                }
                                className="rounded-md p-2 hover:bg-muted disabled:opacity-50"
                                aria-label="Close dialog"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Are you sure you want to cancel this appointment?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={cancellingId !== null}
                                onClick={() =>
                                    setSelectedAppointmentId(null)
                                }
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                            >
                                Keep Appointment
                            </button>

                            <button
                                type="button"
                                disabled={cancellingId !== null}
                                onClick={handleCancelAppointment}
                                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cancellingId
                                    ? "Cancelling..."
                                    : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {selectedAppointmentForDetails && (
                <AppointmentDetailsModal
                    appointment={selectedAppointmentForDetails}
                    onClose={() => setSelectedAppointmentForDetails(null)}
                />
            )}
        </div>
    );
};

export default MyAppointmentsPage;