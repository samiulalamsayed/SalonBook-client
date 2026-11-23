"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    Clock,
    Phone,
    MessageSquare,
    Loader2,
    LockKeyhole,
} from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

interface AppointmentBookingFormProps {
    serviceId: string;
}

const timeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
];

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export default function AppointmentBookingForm({
    serviceId,
}: AppointmentBookingFormProps) {
    const router = useRouter();
    const { data: session, isPending } = useAuth();

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Appointment Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending || isSubmitting) return;

        // Authentication Check
        if (!session?.user) {
            toast.error("Please Sign In to book an appointment.");

            router.push(
                `/sign-in?callbackURL=${encodeURIComponent(
                    `/services/${serviceId}`
                )}`
            );

            return;
        }

        // Customer Role Check
        if (session.user.role !== "customer") {
            toast.error("Only customers can book appointments.");
            return;
        }

        // Required Fields Validation
        if (!appointmentDate || !appointmentTime || !phoneNumber.trim()) {
            toast.error("Please complete all required fields.");
            return;
        }

        // Bangladesh Mobile Number Validation
        if (!/^01[3-9]\d{8}$/.test(phoneNumber.trim())) {
            toast.error("Please enter a valid Bangladeshi mobile number.");
            return;
        }

        // Date Validation
        if (appointmentDate < getTodayDate()) {
            toast.error("Please select a valid appointment date.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await apiFetch("/api/appointments", {
                method: "POST",
                body: JSON.stringify({
                    serviceId,
                    appointmentDate,
                    appointmentTime,
                    phoneNumber: phoneNumber.trim(),
                    message: message.trim(),
                }),
            });

            toast.success(
                result.message || "Appointment booked successfully!"
            );

            setAppointmentDate("");
            setAppointmentTime("");
            setPhoneNumber("");
            setMessage("");

            router.push("/customer/appointments");

        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to book appointment.";

            toast.error(errorMessage);

        } finally {
            setIsSubmitting(false);
        }
    };

    // Authentication Loading
    if (isPending) {
        return (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-card p-8">
                <div className="text-center">
                    <Loader2
                        className="mx-auto animate-spin text-primary"
                        size={32}
                    />

                    <p className="mt-3 text-sm text-muted-foreground">
                        Checking your account...
                    </p>
                </div>
            </div>
        );
    }

    // Guest: Sign In Required
    if (!session?.user) {
        return (
            <div className="rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">

                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LockKeyhole size={25} />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                    Sign In Required
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Please sign in to your customer account before booking
                    an appointment.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            `/sign-in?callbackURL=${encodeURIComponent(
                                `/services/${serviceId}`
                            )}`
                        )
                    }
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                    Sign In to Book
                </button>

                <p className="mt-4 text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/sign-up?callbackURL=${encodeURIComponent(
                                    `/services/${serviceId}`
                                )}`
                            )
                        }
                        className="font-semibold text-primary hover:underline"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        );
    }

    // Admin or Other Role: Booking Not Allowed
    if (session.user.role !== "customer") {
        return (
            <div className="rounded-2xl border bg-muted/30 p-6 text-center sm:p-8">

                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <LockKeyhole size={25} />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                    Customer Access Only
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Appointment booking is available only for customer
                    accounts. You can still explore our salon services.
                </p>
            </div>
        );
    }

    // Customer: Appointment Booking Form
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">

            <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                    Book an Appointment
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Select your preferred date and time to request an appointment.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Appointment Date */}
                <div>
                    <label
                        htmlFor="appointmentDate"
                        className="mb-2 flex items-center gap-2 text-sm font-medium"
                    >
                        <CalendarDays size={17} />
                        Appointment Date *
                    </label>

                    <input
                        id="appointmentDate"
                        type="date"
                        min={getTodayDate()}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Available Time Slot */}
                <div>
                    <label
                        htmlFor="appointmentTime"
                        className="mb-2 flex items-center gap-2 text-sm font-medium"
                    >
                        <Clock size={17} />
                        Available Time Slot *
                    </label>

                    <select
                        id="appointmentTime"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Select a time slot</option>

                        {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>

                    <p className="mt-2 text-xs text-muted-foreground">
                        Available booking hours: 10:00 AM – 6:00 PM.
                    </p>
                </div>

                {/* Mobile Number */}
                <div>
                    <label
                        htmlFor="phoneNumber"
                        className="mb-2 flex items-center gap-2 text-sm font-medium"
                    >
                        <Phone size={17} />
                        Mobile Number *
                    </label>

                    <input
                        id="phoneNumber"
                        type="tel"
                        inputMode="numeric"
                        placeholder="01XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={11}
                        required
                        pattern="01[3-9][0-9]{8}"
                        title="Enter a valid 11-digit Bangladeshi mobile number."
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                        We will use this number to contact you about your appointment.
                    </p>
                </div>

                {/* Additional Message */}
                <div>
                    <label
                        htmlFor="message"
                        className="mb-2 flex items-center gap-2 text-sm font-medium"
                    >
                        <MessageSquare size={17} />
                        Additional Message (Optional)
                    </label>

                    <textarea
                        id="message"
                        rows={4}
                        maxLength={500}
                        placeholder="Tell us if you have any special requests..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <p className="mt-1 text-right text-xs text-muted-foreground">
                        {message.length}/500
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Booking Appointment...
                        </>
                    ) : (
                        "Request Appointment"
                    )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                    Your appointment will remain Pending until confirmed
                    by the admin. Payment will be available after confirmation.
                </p>

            </form>
        </div>
    );
}