"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    RefreshCw,
    Scissors,
    Filter,
    Power,
} from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";

interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: "active" | "inactive";
    createdAt: string;
}

interface ServiceResponse {
    success: boolean;
    message: string;
    total: number;
    data: Service[];
}

const ManageServicesPage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    // Fetch All Services
    const fetchServices = async () => {
        try {
            setIsLoading(true);
            setError("");

            const result: ServiceResponse = await apiFetch(
                "/api/services/admin/all"
            );

            if (!result.success) {
                throw new Error(result.message || "Failed to fetch services.");
            }

            setServices(result.data || []);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load services."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Categories
    const categories = Array.from(
        new Set(services.map((service) => service.category).filter(Boolean))
    );

    // Filter Services
    const filteredServices = services.filter((service) => {
        const matchesSearch = service.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "all" || service.category === category;

        const matchesStatus =
            status === "all" || service.status === status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Delete Service
    const handleDelete = async () => {
        if (!selectedService) return;

        try {
            setDeletingId(selectedService._id);

            const result = await apiFetch(
                `/api/services/${selectedService._id}`,
                {
                    method: "DELETE",
                }
            );

            if (!result.success) {
                throw new Error(result.message || "Failed to delete service.");
            }

            setServices((previous) =>
                previous.filter(
                    (service) => service._id !== selectedService._id
                )
            );

            toast.success("Service deleted successfully!");
            setSelectedService(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete service."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // Activate / Deactivate Service
    const handleStatusChange = async (service: Service) => {
        const newStatus =
            service.status === "active" ? "inactive" : "active";

        try {
            setUpdatingStatusId(service._id);

            const result = await apiFetch(
                `/api/services/${service._id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to update service status."
                );
            }

            setServices((previous) =>
                previous.map((item) =>
                    item._id === service._id
                        ? { ...item, status: newStatus }
                        : item
                )
            );

            toast.success(
                `Service ${newStatus === "active" ? "activated" : "deactivated"
                } successfully!`
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update service status."
            );
        } finally {
            setUpdatingStatusId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Manage Services
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create, update and manage your salon services.
                    </p>
                </div>

                <Link
                    href="/admin/services/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <Plus size={18} />
                    Add New Service
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">
                        Total Services
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        {services.length}
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">
                        Active Services
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                        {services.filter((item) => item.status === "active").length}
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-muted-foreground">
                        Inactive Services
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-600">
                        {services.filter((item) => item.status === "inactive").length}
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                        type="text"
                        placeholder="Search service name..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Filter
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="h-11 min-w-36 rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                        >
                            <option value="all">All Categories</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-11 min-w-32 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-80 animate-pulse rounded-xl border bg-background"
                        />
                    ))}
                </div>
            ) : error ? (
                /* Error State */
                <div className="rounded-xl border bg-background p-10 text-center">
                    <p className="font-medium text-destructive">{error}</p>

                    <button
                        type="button"
                        onClick={fetchServices}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            ) : filteredServices.length === 0 ? (
                /* Empty State */
                <div className="rounded-xl border bg-background px-6 py-16 text-center">
                    <Scissors
                        size={35}
                        className="mx-auto text-muted-foreground"
                    />

                    <h3 className="mt-4 text-lg font-semibold">
                        No Services Found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Try changing your search or filter.
                    </p>
                </div>
            ) : (
                /* Services Grid */
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredServices.map((service) => (
                        <article
                            key={service._id}
                            className="overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md"
                        >
                            {/* Service Image */}
                            <div className="relative h-48 bg-muted">
                                {service.image ? (
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No Image
                                    </div>
                                )}

                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${service.status === "active"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}
                                >
                                    {service.status}
                                </span>
                            </div>

                            {/* Service Details */}
                            <div className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {service.category}
                                </p>

                                <h3 className="mt-2 text-lg font-bold">
                                    {service.name}
                                </h3>

                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {service.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Price
                                        </p>
                                        <p className="text-lg font-bold">
                                            ৳{service.price.toLocaleString("en-BD")}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            Duration
                                        </p>
                                        <p className="text-sm font-medium">
                                            {service.duration} min
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Link
                                        href={`/admin/services/${service._id}/edit`}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                        <Pencil size={15} />
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange(service)}
                                        disabled={
                                            updatingStatusId === service._id
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                                    >
                                        <Power size={15} />

                                        {updatingStatusId === service._id
                                            ? "Updating..."
                                            : service.status === "active"
                                                ? "Deactivate"
                                                : "Activate"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedService(service)}
                                        className="inline-flex items-center justify-center rounded-lg border border-destructive/30 px-3 py-2 text-destructive transition-colors hover:bg-destructive/10"
                                        aria-label={`Delete ${service.name}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Result Count */}
            {!isLoading && !error && (
                <p className="text-sm text-muted-foreground">
                    Showing {filteredServices.length} of {services.length} services
                </p>
            )}

            {/* Delete Confirmation Dialog */}
            {selectedService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <h3 className="text-lg font-bold">
                            Delete Service?
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <strong>{selectedService.name}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={deletingId !== null}
                                onClick={() => setSelectedService(null)}
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                            >
                                Keep Service
                            </button>

                            <button
                                type="button"
                                disabled={deletingId !== null}
                                onClick={handleDelete}
                                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
                            >
                                {deletingId ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServicesPage;