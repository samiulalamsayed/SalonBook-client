"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Clock3,
    ArrowRight,
    Scissors,
    SlidersHorizontal,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
}

const categories = [
    "All Categories",
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ServicesBrowser() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All Categories");

    const [sortOrder, setSortOrder] = useState("default");

    // Fetch Active Services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/services`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch salon services.");
                }

                const result = await response.json();

                setServices(result.data || []);
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

        fetchServices();
    }, []);

    // Read Category from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");

        if (
            category &&
            categories.includes(category)
        ) {
            setSelectedCategory(category);
        }
    }, []);

    // Search, Filter and Sorting
    const filteredServices = useMemo(() => {
        let result = [...services];

        // Search by name
        if (searchTerm.trim()) {
            result = result.filter((service) =>
                service.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim())
            );
        }

        // Category Filter
        if (selectedCategory !== "All Categories") {
            result = result.filter(
                (service) => service.category === selectedCategory
            );
        }

        // Price Sorting
        if (sortOrder === "low-to-high") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "high-to-low") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [services, searchTerm, selectedCategory, sortOrder]);

    return (
        <section className="min-h-screen bg-background">
            {/* Page Banner */}
            <div className="bg-rose-50/70 px-5 py-16 dark:bg-rose-950/10 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                        Discover Our Services
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                        Explore Our Salon Services
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        Discover the perfect beauty and wellness treatments
                        designed to help you look and feel your best.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
                {/* Search and Filters */}
                <div className="mb-8 rounded-2xl border bg-card p-4 sm:p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_240px_200px]">
                        {/* Search */}
                        <div className="relative">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search services by name..."
                                className="w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-rose-400"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <SlidersHorizontal
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <select
                                value={selectedCategory}
                                onChange={(event) =>
                                    setSelectedCategory(event.target.value)
                                }
                                className="w-full appearance-none rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-400"
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sorting */}
                        <select
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(event.target.value)
                            }
                            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                        >
                            <option value="default">
                                Default Sorting
                            </option>

                            <option value="low-to-high">
                                Price: Low to High
                            </option>

                            <option value="high-to-low">
                                Price: High to Low
                            </option>
                        </select>
                    </div>
                </div>

                {/* Result Information */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold">
                            Available Services
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {isLoading
                                ? "Loading services..."
                                : `${filteredServices.length} services found`}
                        </p>
                    </div>

                    {(searchTerm ||
                        selectedCategory !== "All Categories" ||
                        sortOrder !== "default") && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All Categories");
                                setSortOrder("default");
                            }}
                            className="text-sm font-medium text-rose-600 hover:underline"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-72 items-center justify-center">
                        <Loader2
                            size={35}
                            className="animate-spin text-rose-500"
                        />
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center">
                        <AlertCircle
                            size={38}
                            className="text-destructive"
                        />

                        <h3 className="font-semibold">
                            Unable to Load Services
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Service Cards */}
                {!isLoading && !error && filteredServices.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service) => (
                            <article
                                key={service._id}
                                className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-muted">
                                    {service.image ? (
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Scissors
                                                size={40}
                                                className="text-muted-foreground"
                                            />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
                                        {service.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold transition group-hover:text-rose-600">
                                        {service.name}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
                                        {service.description}
                                    </p>

                                    {/* Price and Duration */}
                                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Price
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-rose-600">
                                                ৳
                                                {service.price.toLocaleString(
                                                    "en-BD"
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Clock3 size={15} />
                                            {service.duration} min
                                        </div>
                                    </div>

                                    {/* Details Button */}
                                    <Link
                                        href={`/services/${service._id}`}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                                    >
                                        View Details
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading &&
                    !error &&
                    filteredServices.length === 0 && (
                        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center">
                            <Search
                                size={40}
                                className="text-muted-foreground"
                            />

                            <h3 className="mt-4 text-lg font-semibold">
                                No Services Found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                We couldn't find any services matching your
                                search. Try another keyword or category.
                            </p>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All Categories");
                                    setSortOrder("default");
                                }}
                                className="mt-5 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
            </div>
        </section>
    );
}