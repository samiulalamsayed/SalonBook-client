import Link from "next/link";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                    <XCircle className="h-12 w-12 text-red-600" />
                </div>

                <h1 className="mt-6 text-3xl font-bold">
                    Payment Cancelled
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Your payment was not completed. Don't worry!
                    Your appointment is still available for payment.
                </p>

                <div className="mt-8 rounded-xl bg-muted/50 p-5 text-left">
                    <h2 className="font-bold">
                        What happens next?
                    </h2>

                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>
                            • Your appointment remains confirmed.
                        </li>
                        <li>
                            • Your payment status remains unpaid.
                        </li>
                        <li>
                            • You can try making the payment again.
                        </li>
                    </ul>
                </div>

                <Link
                    href="/customer/appointments"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                    <CreditCard size={18} />
                    Try Payment Again
                </Link>

                <Link
                    href="/customer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}