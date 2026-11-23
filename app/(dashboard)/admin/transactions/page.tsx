"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    CreditCard,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Loader2,
    CalendarDays,
    User,
    Scissors,
    Copy,
    X,
    Eye,
    AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";

interface Transaction {
    _id: string;
    appointmentId: {
        _id: string;
        appointmentDate: string;
        appointmentTime: string;
        totalAmount: number;
        status: string;
        serviceId?: {
            _id: string;
            name: string;
            category: string;
            image?: string;
        };
    };
    customerId: string;
    customer?: {
        name: string;
        email: string;
        image?: string;
    };
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: "paid" | "failed";
    createdAt: string;
    updatedAt: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);

    const fetchTransactions = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError("");

            const result = await apiFetch("/api/payments/transactions");

            setTransactions(result.data || []);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to load transactions.";

            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = transactions.filter((transaction) => {
        const search = searchTerm.toLowerCase();

        const customerName = transaction.customer?.name || "";
        const customerEmail = transaction.customer?.email || "";
        const serviceName =
            transaction.appointmentId?.serviceId?.name || "";

        const matchesSearch =
            customerName.toLowerCase().includes(search) ||
            customerEmail.toLowerCase().includes(search) ||
            serviceName.toLowerCase().includes(search) ||
            transaction.stripeSessionId.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            transaction.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalTransactions = transactions.length;

    const successfulTransactions = transactions.filter(
        (transaction) => transaction.status === "paid"
    );

    const failedTransactions = transactions.filter(
        (transaction) => transaction.status === "failed"
    );

    const totalRevenue = successfulTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
    );

    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (date?: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const copySessionId = async (sessionId: string) => {
        try {
            await navigator.clipboard.writeText(sessionId);
            toast.success("Stripe Session ID copied.");
        } catch {
            toast.error("Unable to copy Session ID.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Monitor payments and transaction history.
                    </p>
                </div>

                <button
                    onClick={() => fetchTransactions(false)}
                    disabled={isRefreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={isRefreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Transactions"
                    value={totalTransactions.toString()}
                    description="All recorded transactions"
                    icon={<CreditCard size={22} />}
                />

                <StatCard
                    title="Successful Payments"
                    value={successfulTransactions.length.toString()}
                    description="Successfully paid transactions"
                    icon={<CheckCircle2 size={22} />}
                />

                <StatCard
                    title="Failed Payments"
                    value={failedTransactions.length.toString()}
                    description="Unsuccessful transactions"
                    icon={<XCircle size={22} />}
                />

                <StatCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString("en-BD")}`}
                    description="From successful payments"
                    icon={<CreditCard size={22} />}
                />
            </div>

            {/* Search and Filter */}
            <div className="rounded-xl border bg-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search customer, service or Stripe Session ID..."
                            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                        <option value="all">All Transactions</option>
                        <option value="paid">Successful</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="border-b p-4">
                    <h2 className="font-semibold">Transaction History</h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {filteredTransactions.length} transactions found
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex min-h-60 items-center justify-center">
                        <Loader2
                            size={30}
                            className="animate-spin text-primary"
                        />
                    </div>
                ) : error ? (
                    <div className="flex min-h-60 flex-col items-center justify-center gap-3 p-6 text-center">
                        <AlertCircle
                            size={32}
                            className="text-destructive"
                        />

                        <p className="text-sm text-muted-foreground">
                            {error}
                        </p>

                        <button
                            onClick={() => fetchTransactions()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="flex min-h-60 flex-col items-center justify-center gap-2 p-6 text-center">
                        <CreditCard
                            size={35}
                            className="text-muted-foreground"
                        />

                        <h3 className="font-semibold">
                            No transactions found
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Transactions will appear here after payment
                            attempts are recorded.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Service
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Amount
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Appointment Date
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Payment Status
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Transaction Date
                                    </th>

                                    <th className="px-5 py-4 text-right font-medium">
                                        Details
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className="transition hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {transaction.customer?.name ||
                                                    "Unknown Customer"}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {transaction.customer?.email ||
                                                    transaction.customerId}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {transaction.appointmentId
                                                    ?.serviceId?.name ||
                                                    "Unknown Service"}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {transaction.appointmentId
                                                    ?.serviceId?.category ||
                                                    "N/A"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 font-semibold">
                                            {formatCurrency(
                                                transaction.amount,
                                                transaction.currency
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <p>
                                                {formatDate(
                                                    transaction.appointmentId
                                                        ?.appointmentDate
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {transaction.appointmentId
                                                    ?.appointmentTime || "N/A"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <PaymentBadge
                                                status={transaction.status}
                                            />
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatDate(
                                                transaction.createdAt
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    setSelectedTransaction(
                                                        transaction
                                                    )
                                                }
                                                title="View Transaction Details"
                                                className="rounded-lg border p-2 transition hover:bg-muted"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedTransaction(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Transaction Details
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Complete payment information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedTransaction(null)
                                }
                                className="rounded-lg p-2 transition hover:bg-muted"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-6 rounded-xl bg-muted/50 p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Transaction Amount
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                                {formatCurrency(
                                    selectedTransaction.amount,
                                    selectedTransaction.currency
                                )}
                            </p>

                            <div className="mt-3">
                                <PaymentBadge
                                    status={selectedTransaction.status}
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <DetailSection
                                title="Customer Information"
                                icon={<User size={18} />}
                            >
                                <DetailRow
                                    label="Name"
                                    value={
                                        selectedTransaction.customer?.name ||
                                        "Unknown Customer"
                                    }
                                />

                                <DetailRow
                                    label="Email"
                                    value={
                                        selectedTransaction.customer?.email ||
                                        "Not available"
                                    }
                                />
                            </DetailSection>

                            <DetailSection
                                title="Appointment Information"
                                icon={<Scissors size={18} />}
                            >
                                <DetailRow
                                    label="Service"
                                    value={
                                        selectedTransaction.appointmentId
                                            ?.serviceId?.name ||
                                        "Unknown Service"
                                    }
                                />

                                <DetailRow
                                    label="Category"
                                    value={
                                        selectedTransaction.appointmentId
                                            ?.serviceId?.category || "N/A"
                                    }
                                />

                                <DetailRow
                                    label="Appointment Date"
                                    value={formatDate(
                                        selectedTransaction.appointmentId
                                            ?.appointmentDate
                                    )}
                                />

                                <DetailRow
                                    label="Appointment Time"
                                    value={
                                        selectedTransaction.appointmentId
                                            ?.appointmentTime || "N/A"
                                    }
                                />

                                <DetailRow
                                    label="Appointment Status"
                                    value={
                                        selectedTransaction.appointmentId
                                            ?.status || "N/A"
                                    }
                                />
                            </DetailSection>

                            <DetailSection
                                title="Payment Information"
                                icon={<CreditCard size={18} />}
                            >
                                <DetailRow
                                    label="Currency"
                                    value={selectedTransaction.currency.toUpperCase()}
                                />

                                <DetailRow
                                    label="Payment Status"
                                    value={selectedTransaction.status.toUpperCase()}
                                />

                                <DetailRow
                                    label="Transaction Date"
                                    value={formatDateTime(
                                        selectedTransaction.createdAt
                                    )}
                                />

                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        Stripe Session ID
                                    </p>

                                    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                                        <p className="min-w-0 flex-1 break-all text-xs">
                                            {selectedTransaction.stripeSessionId}
                                        </p>

                                        <button
                                            onClick={() =>
                                                copySessionId(
                                                    selectedTransaction.stripeSessionId
                                                )
                                            }
                                            className="shrink-0 rounded-md p-2 transition hover:bg-muted"
                                            title="Copy Session ID"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    </div>
                                </div>
                            </DetailSection>
                        </div>

                        <button
                            onClick={() => setSelectedTransaction(null)}
                            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Statistics Card
function StatCard({
    title,
    value,
    description,
    icon,
}: {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-2xl font-bold">{value}</p>

            <p className="mt-1 text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

// Payment Status Badge
function PaymentBadge({
    status,
}: {
    status: "paid" | "failed";
}) {
    const isPaid = status === "paid";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
        >
            {isPaid ? (
                <CheckCircle2 size={13} />
            ) : (
                <XCircle size={13} />
            )}

            {isPaid ? "Successful" : "Failed"}
        </span>
    );
}

// Details Section
function DetailSection({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <span className="text-primary">{icon}</span>
                {title}
            </h3>

            <div className="space-y-3 rounded-xl border p-4">
                {children}
            </div>
        </div>
    );
}

// Details Row
function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">
                {label}
            </span>

            <span className="break-all text-right font-medium">
                {value}
            </span>
        </div>
    );
}