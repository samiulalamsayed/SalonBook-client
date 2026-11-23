import Link from "next/link";
import {
    ArrowUpRight,
    Scissors,
    Palette,
    Sparkles,
    Heart,
    Flower2,
    Hand,
} from "lucide-react";

const categories = [
    {
        name: "Haircut & Styling",
        description: "Find your perfect look.",
        icon: Scissors,
        color: "bg-rose-100 text-rose-600",
    },
    {
        name: "Hair Coloring",
        description: "Express yourself with color.",
        icon: Palette,
        color: "bg-purple-100 text-purple-600",
    },
    {
        name: "Hair Treatment",
        description: "Care for healthy hair.",
        icon: Sparkles,
        color: "bg-amber-100 text-amber-600",
    },
    {
        name: "Facial & Skincare",
        description: "Glow with confidence.",
        icon: Heart,
        color: "bg-pink-100 text-pink-600",
    },
    {
        name: "Makeup",
        description: "Look beautiful, feel amazing.",
        icon: Flower2,
        color: "bg-orange-100 text-orange-600",
    },
    {
        name: "Manicure & Pedicure",
        description: "Care for your hands and feet.",
        icon: Hand,
        color: "bg-teal-100 text-teal-600",
    },
    {
        name: "Spa & Massage",
        description: "Relax, refresh and recharge.",
        icon: Sparkles,
        color: "bg-indigo-100 text-indigo-600",
    },
];

export default function ServiceCategories() {
    return (
        <section className="bg-rose-50/60 px-5 py-20 sm:px-8 lg:px-10 lg:py-24 dark:bg-rose-950/10">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                        Explore Categories
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Beauty Services for Every You
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                        Whatever your beauty needs, find the right treatment
                        from our wide range of salon services.
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.name}
                                href={`/services?category=${encodeURIComponent(
                                    category.name
                                )}`}
                                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
                            >
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${category.color}`}
                                >
                                    <Icon size={25} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold transition group-hover:text-rose-600">
                                        {category.name}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {category.description}
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="shrink-0 text-muted-foreground transition group-hover:text-rose-600"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}