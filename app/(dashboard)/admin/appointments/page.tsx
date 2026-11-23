"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    UserRound,
    Scissors,
    RefreshCw,
    Eye,
    CheckCircle2,
    XCircle,
    Search,
    X,
} from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";

interface Service {
    _id: string;
    name: string;
    category: string;
    price: number;
    duration: number;
    image: string;
}

interface Customer {
    _id?: string;
    name: string;
    email: string;
}

interface Appointment {
    _id: string;
    customer: Customer | null;
    serviceId: Service | null;
    appointmentDate: string;
    appointmentTime: string;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "unpaid" | "paid";
    message?: string;
    createdAt: string;
}

interface AppointmentResponse {
    success: boolean;
    message: string;
    total: number;
    data: Appointment[];
}

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
    };

    return styles[status] || "bg-muted text-muted-foreground";
};

const getPaymentStyle = (status: string) =>
    status === "paid"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700";

const AdminAppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);

    const [confirmation, setConfirmation] = useState<{
        appointment: Appointment;
        status: "confirmed" | "cancelled";
    } | null>(null);

    // Fetch All Appointments
    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            setError("");

            const result: AppointmentResponse = await apiFetch(
                "/api/appointments"
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch appointments."
                );
            }

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

    // Update Appointment Status
    const handleStatusUpdate = async () => {
        if (!confirmation) return;

        const { appointment, status } = confirmation;

        try {
            setUpdatingId(appointment._id);

            const result = await apiFetch(
                `/api/appointments/${appointment._id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to update appointment."
                );
            }

            setAppointments((previous) =>
                previous.map((item) =>
                    item._id === appointment._id
                        ? { ...item, status }
                        : item
                )
            );

            if (selectedAppointment?._id === appointment._id) {
                setSelectedAppointment((previous) =>
                    previous ? { ...previous, status } : null
                );
            }

            toast.success(
                status === "confirmed"
                    ? "Appointment confirmed successfully!"
                    : "Appointment cancelled successfully!"
            );

            setConfirmation(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update appointment."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Search and Filter
    const filteredAppointments = appointments.filter((appointment) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            appointment.customer?.name?.toLowerCase().includes(searchValue) ||
            appointment.customer?.email?.toLowerCase().includes(searchValue) ||
            appointment.serviceId?.name?.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "all" ||
            appointment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: appointments.length,
        pending: appointments.filter((item) => item.status === "pending").length,
        confirmed: appointments.filter((item) => item.status === "confirmed").length,
        cancelled: appointments.filter((item) => item.status === "cancelled").length,
    };

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Manage Appointments
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Review and manage all customer appointment requests.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        title: "Total Appointments",
                        value: stats.total,
                        color: "text-primary",
                    },
                    {
                        title: "Pending",
                        value: stats.pending,
                        color: "text-amber-600",
                    },
                    {
                        title: "Confirmed",
                        value: stats.confirmed,
                        color: "text-emerald-600",
                    },
                    {
                        title: "Cancelled",
                        value: stats.cancelled,
                        color: "text-red-600",
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border bg-background p-5 shadow-sm"
                    >
                        <p className="text-sm text-muted-foreground">
                            {item.title}
                        </p>

                        <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search customer or service..."
                        className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-11 rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                >
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-xl border bg-background"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border bg-background p-10 text-center">
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
            ) : filteredAppointments.length === 0 ? (
                <div className="rounded-xl border bg-background px-6 py-16 text-center">
                    <CalendarDays
                        size={35}
                        className="mx-auto text-muted-foreground"
                    />

                    <h3 className="mt-4 text-lg font-semibold">
                        No Appointments Found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        No appointment matches your search or filter.
                    </p>
                </div>
            ) : (
                /* Appointment List */
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                        <article
                            key={appointment._id}
                            className="overflow-hidden rounded-xl border bg-background shadow-sm"
                        >
                            <div className="p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                                            {appointment.serviceId?.category}
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold">
                                            {appointment.serviceId?.name ||
                                                "Service Unavailable"}
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            ID: {appointment._id}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                            appointment.status
                                        )}`}
                                    >
                                        {appointment.status}
                                    </span>
                                </div>

                                {/* Customer and Service Information */}
                                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex items-start gap-3">
                                        <UserRound
                                            size={18}
                                            className="mt-1 text-muted-foreground"
                                        />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Customer
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {appointment.customer?.name ||
                                                    "Unknown Customer"}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {appointment.customer?.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Scissors
                                            size={18}
                                            className="mt-1 text-muted-foreground"
                                        />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Service
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {appointment.serviceId?.name ||
                                                    "Unavailable"}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                ৳
                                                {appointment.totalAmount.toLocaleString(
                                                    "en-BD"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            size={18}
                                            className="mt-1 text-muted-foreground"
                                        />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Appointment Date
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {formatDate(
                                                    appointment.appointmentDate
                                                )}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {appointment.appointmentTime}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock
                                            size={18}
                                            className="mt-1 text-muted-foreground"
                                        />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Request Date
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {formatDate(appointment.createdAt)}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Payment:{" "}
                                                <span
                                                    className={`rounded-full px-2 py-0.5 font-semibold capitalize ${getPaymentStyle(
                                                        appointment.paymentStatus
                                                    )}`}
                                                >
                                                    {appointment.paymentStatus}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedAppointment(appointment)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>

                                    {appointment.status === "pending" && (
                                        <button
                                            type="button"
                                            disabled={updatingId !== null}
                                            onClick={() =>
                                                setConfirmation({
                                                    appointment,
                                                    status: "confirmed",
                                                })
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={16} />
                                            Confirm
                                        </button>
                                    )}

                                    {(appointment.status === "pending" ||
                                        appointment.status === "confirmed") && (
                                            <button
                                                type="button"
                                                disabled={updatingId !== null}
                                                onClick={() =>
                                                    setConfirmation({
                                                        appointment,
                                                        status: "cancelled",
                                                    })
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                            >
                                                <XCircle size={16} />
                                                Cancel
                                            </button>
                                        )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Result Count */}
            {!isLoading && !error && (
                <p className="text-sm text-muted-foreground">
                    Showing {filteredAppointments.length} of {appointments.length} appointments
                </p>
            )}

            {/* Appointment Details Dialog */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                Appointment Details
                            </h3>

                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="rounded-md p-2 hover:bg-muted"
                                aria-label="Close details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Customer
                                </p>
                                <p className="font-semibold">
                                    {selectedAppointment.customer?.name || "Unknown"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedAppointment.customer?.email || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Service
                                </p>
                                <p className="font-semibold">
                                    {selectedAppointment.serviceId?.name || "Unavailable"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Appointment Date
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(selectedAppointment.appointmentDate)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Appointment Time
                                    </p>
                                    <p className="text-sm font-medium">
                                        {selectedAppointment.appointmentTime}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Service Price
                                    </p>
                                    <p className="text-sm font-medium">
                                        ৳{selectedAppointment.totalAmount.toLocaleString("en-BD")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Request Date
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(selectedAppointment.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Appointment Status
                                </p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                        selectedAppointment.status
                                    )}`}
                                >
                                    {selectedAppointment.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Payment Status
                                </p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStyle(
                                        selectedAppointment.paymentStatus
                                    )}`}
                                >
                                    {selectedAppointment.paymentStatus}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Customer Message
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-sm">
                                    {selectedAppointment.message ||
                                        "No additional message provided."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedAppointment(null)}
                            className="mt-6 w-full rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Status Confirmation Dialog */}
            {confirmation && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <h3 className="text-lg font-bold">
                            {confirmation.status === "confirmed"
                                ? "Confirm Appointment?"
                                : "Cancel Appointment?"}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Are you sure you want to{" "}
                            {confirmation.status === "confirmed"
                                ? "confirm"
                                : "cancel"}{" "}
                            this appointment for{" "}
                            <strong>
                                {confirmation.appointment.customer?.name ||
                                    "this customer"}
                            </strong>
                            ?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={updatingId !== null}
                                onClick={() => setConfirmation(null)}
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                            >
                                Go Back
                            </button>

                            <button
                                type="button"
                                disabled={updatingId !== null}
                                onClick={handleStatusUpdate}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${confirmation.status === "confirmed"
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-destructive hover:bg-destructive/90"
                                    }`}
                            >
                                {updatingId
                                    ? "Updating..."
                                    : confirmation.status === "confirmed"
                                        ? "Yes, Confirm"
                                        : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointmentsPage;