"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    CheckCircle2,
    Loader2,
    AlertCircle,
    CalendarDays,
    Clock,
    ArrowRight,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

interface PaymentDetails {
    appointment: {
        _id: string;
        appointmentDate: string;
        appointmentTime: string;
        totalAmount: number;
        serviceId: {
            name: string;
            price: number;
        } | null;
    };
    amount: number;
    currency: string;
    paymentStatus: string;
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [payment, setPayment] = useState<PaymentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setError("Payment session ID is missing.");
            setLoading(false);
            return;
        }

        const verifyPayment = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await apiFetch(
                    `/api/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`
                );

                if (!result.success) {
                    throw new Error(
                        result.message || "Payment verification failed."
                    );
                }

                setPayment(result.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to verify your payment."
                );
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />

                    <h2 className="mt-5 text-xl font-bold">
                        Verifying Your Payment
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Please wait while we confirm your payment.
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !payment) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                    <AlertCircle className="mx-auto h-16 w-16 text-destructive" />

                    <h1 className="mt-5 text-2xl font-bold">
                        Payment Verification Failed
                    </h1>

                    <p className="mt-3 text-sm text-muted-foreground">
                        {error || "We couldn't verify your payment."}
                    </p>

                    <Link
                        href="/customer/appointments"
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        My Appointments
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    const appointment = payment.appointment;

    // Success State
    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                <h1 className="mt-6 text-3xl font-bold">
                    Payment Successful!
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Your payment has been successfully verified.
                    Thank you for choosing SalonBook!
                </p>

                <div className="mt-8 rounded-xl bg-muted/50 p-5 text-left">
                    <h2 className="mb-4 text-lg font-bold">
                        Payment Details
                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                                Service
                            </span>

                            <span className="text-right text-sm font-semibold">
                                {appointment.serviceId?.name || "Service"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                                Amount Paid
                            </span>

                            <span className="font-bold text-green-600">
                                ৳{payment.amount.toLocaleString("en-BD")}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                                Payment Status
                            </span>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:bg-green-950 dark:text-green-400">
                                {payment.paymentStatus}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays size={15} />
                                Appointment Date
                            </span>

                            <span className="text-sm font-medium">
                                {new Date(
                                    appointment.appointmentDate
                                ).toLocaleDateString("en-BD")}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock size={15} />
                                Appointment Time
                            </span>

                            <span className="text-sm font-medium">
                                {appointment.appointmentTime}
                            </span>
                        </div>

                    </div>
                </div>

                <Link
                    href="/customer/appointments"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                    View My Appointments
                    <ArrowRight size={18} />
                </Link>

                <Link
                    href="/customer"
                    className="mt-4 inline-block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    Go to Dashboard
                </Link>

            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[70vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}