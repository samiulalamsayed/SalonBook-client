"use client";

import {
    X,
    CalendarDays,
    Clock,
    Phone,
    Mail,
    CreditCard,
    Scissors,
    MessageSquare,
} from "lucide-react";

interface AppointmentDetailsModalProps {
    appointment: {
        _id: string;
        customer?: {
            name: string;
            email: string;
        };
        serviceId: {
            name: string;
            category?: string;
            image?: string;
        } | null;
        appointmentDate: string;
        appointmentTime: string;
        phoneNumber?: string;
        totalAmount: number;
        status: string;
        paymentStatus: string;
        message?: string;
        createdAt: string;
    };
    onClose: () => void;
}

export default function AppointmentDetailsModal({
    appointment,
    onClose,
}: AppointmentDetailsModalProps) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
            case "paid":
                return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case "pending":
            case "unpaid":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
            case "cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            case "completed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-background p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        Appointment Details
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-2 hover:bg-muted"
                        aria-label="Close details"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-5 space-y-5">

                    {/* Service */}
                    <div className="flex gap-4">
                        {appointment.serviceId?.image && (
                            <img
                                src={appointment.serviceId.image}
                                alt={appointment.serviceId.name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        )}

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Service
                            </p>

                            <p className="mt-1 font-semibold">
                                {appointment.serviceId?.name || "Unavailable"}
                            </p>

                            {appointment.serviceId?.category && (
                                <p className="text-sm text-muted-foreground">
                                    {appointment.serviceId.category}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Customer
                        </p>

                        <p className="font-semibold">
                            {appointment.customer?.name || "Unknown"}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail size={15} />
                            {appointment.customer?.email || "N/A"}
                        </p>

                        <div className="mt-3">
                            <p className="text-xs text-muted-foreground">
                                Mobile Number
                            </p>

                            {appointment.phoneNumber ? (
                                <a
                                    href={`tel:${appointment.phoneNumber}`}
                                    className="mt-1 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                                >
                                    <Phone size={16} />
                                    {appointment.phoneNumber}
                                </a>
                            ) : (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Not provided
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Appointment Date
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                <CalendarDays size={15} />
                                {formatDate(appointment.appointmentDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Appointment Time
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                <Clock size={15} />
                                {appointment.appointmentTime}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Service Price
                            </p>

                            <p className="mt-1 font-semibold">
                                ৳{appointment.totalAmount.toLocaleString("en-BD")}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Request Date
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                {formatDate(appointment.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Appointment Status
                            </p>

                            <span
                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                            >
                                {appointment.status}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Payment Status
                            </p>

                            <span
                                className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.paymentStatus)}`}
                            >
                                <CreditCard size={13} />
                                {appointment.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquare size={15} />
                            Customer Message
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm">
                            {appointment.message ||
                                "No additional message provided."}
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                    Close
                </button>
            </div>
        </div>
    );
}