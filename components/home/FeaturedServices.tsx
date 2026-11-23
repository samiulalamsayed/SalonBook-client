import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Scissors } from "lucide-react";

interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeaturedServices(): Promise<Service[]> {
    try {
        const response = await fetch(
            `${API_URL}/api/services/featured`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch featured services.");
        }

        const result = await response.json();

        return result.data || [];
    } catch (error) {
        console.error("Featured Services Error:", error);
        return [];
    }
}

export default async function FeaturedServices() {
    const services = await getFeaturedServices();

    return (
        <section className="bg-background px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                            Our Services
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Featured Salon Services
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                            Explore our popular beauty and wellness services,
                            carefully designed to make you look and feel your best.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition hover:gap-3"
                    >
                        Explore All Services
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Service Cards */}
                {services.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.slice(0, 6).map((service) => (
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
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
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

                                    {/* Price & Duration */}
                                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Starting at
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-rose-600">
                                                ৳{service.price.toLocaleString("en-BD")}
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
                ) : (
                    <div className="rounded-2xl border border-dashed py-16 text-center">
                        <Scissors
                            size={40}
                            className="mx-auto text-muted-foreground"
                        />

                        <h3 className="mt-4 text-lg font-semibold">
                            No Featured Services Yet
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Our featured services will appear here soon.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}