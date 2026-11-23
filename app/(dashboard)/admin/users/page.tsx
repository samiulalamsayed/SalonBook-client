"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Search,
    Users,
    UserCheck,
    UserX,
    Eye,
    Ban,
    ShieldCheck,
    X,
    Loader2,
    RefreshCw,
    CalendarDays,
    Mail,
    Phone,
    AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";

interface Customer {
    _id: string;
    name: string;
    email: string;
    image?: string;
    phoneNumber?: string;
    role: string;
    isBlocked: boolean;
    createdAt: string;
}

type ConfirmationAction = {
    user: Customer;
    action: "block" | "unblock";
} | null;

export default function ManageUsersPage() {
    const [users, setUsers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const [confirmation, setConfirmation] =
        useState<ConfirmationAction>(null);

    const [processingId, setProcessingId] = useState<string | null>(null);

    // Fetch all customers
    const fetchUsers = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError("");

            const result = await apiFetch("/api/users");

            setUsers(result.data || []);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to load customers.";

            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch individual customer details
    const handleViewDetails = async (userId: string) => {
        try {
            setIsDetailsLoading(true);
            setSelectedUser(null);

            const result = await apiFetch(`/api/users/${userId}`);

            setSelectedUser(result.data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load customer details."
            );
        } finally {
            setIsDetailsLoading(false);
        }
    };

    // Block or unblock customer
    const handleStatusChange = async () => {
        if (!confirmation) return;

        const { user, action } = confirmation;

        try {
            setProcessingId(user._id);

            const endpoint =
                action === "block"
                    ? `/api/users/${user._id}/block`
                    : `/api/users/${user._id}/unblock`;

            await apiFetch(endpoint, {
                method: "PATCH",
            });

            const updatedStatus = action === "block";

            setUsers((previousUsers) =>
                previousUsers.map((item) =>
                    item._id === user._id
                        ? { ...item, isBlocked: updatedStatus }
                        : item
                )
            );

            setSelectedUser((previousUser) =>
                previousUser?._id === user._id
                    ? { ...previousUser, isBlocked: updatedStatus }
                    : previousUser
            );

            toast.success(
                action === "block"
                    ? "Customer blocked successfully."
                    : "Customer unblocked successfully."
            );

            setConfirmation(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update customer status."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // Search and filter
    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            user.name?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && !user.isBlocked) ||
            (statusFilter === "blocked" && user.isBlocked);

        return matchesSearch && matchesStatus;
    });

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => !user.isBlocked).length;
    const blockedUsers = users.filter((user) => user.isBlocked).length;

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Manage Users
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View and manage your salon customers.
                    </p>
                </div>

                <button
                    onClick={() => fetchUsers(false)}
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Customers"
                    value={totalUsers}
                    icon={<Users size={22} />}
                    description="All registered customers"
                />

                <StatCard
                    title="Active Customers"
                    value={activeUsers}
                    icon={<UserCheck size={22} />}
                    description="Customers with access"
                />

                <StatCard
                    title="Blocked Customers"
                    value={blockedUsers}
                    icon={<UserX size={22} />}
                    description="Customers without access"
                />
            </div>

            {/* Search and Filters */}
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
                            placeholder="Search by customer name or email..."
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
                        <option value="all">All Customers</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        <h2 className="font-semibold">Customer List</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {filteredUsers.length} customers found
                        </p>
                    </div>
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
                            onClick={() => fetchUsers()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex min-h-60 flex-col items-center justify-center gap-2 p-6 text-center">
                        <Users
                            size={35}
                            className="text-muted-foreground"
                        />
                        <h3 className="font-semibold">No customers found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        Customer
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Email
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Joined
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="transition hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar user={user} />

                                                <div>
                                                    <p className="font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Customer
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {user.email}
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                isBlocked={user.isBlocked}
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            user._id
                                                        )
                                                    }
                                                    title="View Details"
                                                    className="rounded-lg border p-2 transition hover:bg-muted"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setConfirmation({
                                                            user,
                                                            action: user.isBlocked
                                                                ? "unblock"
                                                                : "block",
                                                        })
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        user._id
                                                    }
                                                    title={
                                                        user.isBlocked
                                                            ? "Unblock Customer"
                                                            : "Block Customer"
                                                    }
                                                    className={`rounded-lg border p-2 transition disabled:opacity-50 ${user.isBlocked
                                                            ? "text-green-600 hover:bg-green-50"
                                                            : "text-destructive hover:bg-red-50"
                                                        }`}
                                                >
                                                    {user.isBlocked ? (
                                                        <ShieldCheck size={16} />
                                                    ) : (
                                                        <Ban size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Customer Details Modal */}
            {(isDetailsLoading || selectedUser) && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => {
                        if (!isDetailsLoading) setSelectedUser(null);
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                Customer Details
                            </h2>

                            <button
                                onClick={() => setSelectedUser(null)}
                                disabled={isDetailsLoading}
                                className="rounded-lg p-2 transition hover:bg-muted"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {isDetailsLoading ? (
                            <div className="flex min-h-48 items-center justify-center">
                                <Loader2
                                    size={30}
                                    className="animate-spin text-primary"
                                />
                            </div>
                        ) : selectedUser ? (
                            <div className="space-y-5">
                                <div className="flex flex-col items-center gap-3 border-b pb-5">
                                    <UserAvatar
                                        user={selectedUser}
                                        large
                                    />

                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold">
                                            {selectedUser.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Customer
                                        </p>
                                    </div>

                                    <StatusBadge
                                        isBlocked={selectedUser.isBlocked}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <DetailItem
                                        icon={<Mail size={17} />}
                                        label="Email Address"
                                        value={selectedUser.email}
                                    />

                                    <DetailItem
                                        icon={<Phone size={17} />}
                                        label="Phone Number"
                                        value={
                                            selectedUser.phoneNumber ||
                                            "Not provided"
                                        }
                                    />

                                    <DetailItem
                                        icon={<CalendarDays size={17} />}
                                        label="Joined Date"
                                        value={formatDate(
                                            selectedUser.createdAt
                                        )}
                                    />
                                </div>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >
                                    Close
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Block / Unblock Confirmation */}
            {confirmation && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => {
                        if (!processingId) setConfirmation(null);
                    }}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                {confirmation.action === "block"
                                    ? "Block Customer?"
                                    : "Unblock Customer?"}
                            </h2>

                            <button
                                onClick={() => setConfirmation(null)}
                                disabled={!!processingId}
                                className="rounded-lg p-2 hover:bg-muted"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm leading-6 text-muted-foreground">
                            {confirmation.action === "block"
                                ? `Are you sure you want to block ${confirmation.user.name}? This customer will no longer be able to access protected platform features.`
                                : `Are you sure you want to unblock ${confirmation.user.name}? This customer will regain access to protected platform features.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmation(null)}
                                disabled={!!processingId}
                                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleStatusChange}
                                disabled={!!processingId}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${confirmation.action === "block"
                                        ? "bg-destructive hover:opacity-90"
                                        : "bg-green-600 hover:opacity-90"
                                    }`}
                            >
                                {processingId && (
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}

                                {confirmation.action === "block"
                                    ? "Block Customer"
                                    : "Unblock Customer"}
                            </button>
                        </div>
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
    icon,
    description,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
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

            <p className="mt-3 text-3xl font-bold">{value}</p>

            <p className="mt-1 text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

// Customer Avatar
function UserAvatar({
    user,
    large = false,
}: {
    user: Customer;
    large?: boolean;
}) {
    const size = large ? 20 : 10;

    if (user.image) {
        return (
            <div
                className={`relative shrink-0 overflow-hidden rounded-full ${large ? "h-20 w-20" : "h-10 w-10"
                    }`}
            >
                <Image
                    src={user.image}
                    alt={user.name || "Customer"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes={large ? "80px" : "40px"}
                />
            </div>
        );
    }

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${large ? "h-20 w-20 text-2xl" : "h-10 w-10 text-sm"
                }`}
        >
            {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
    );
}

// Status Badge
function StatusBadge({ isBlocked }: { isBlocked: boolean }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isBlocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
        >
            {isBlocked ? "Blocked" : "Active"}
        </span>
    );
}

// Customer Detail Item
function DetailItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>

            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="break-all text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}