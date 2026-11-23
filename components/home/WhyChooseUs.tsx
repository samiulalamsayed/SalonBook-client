import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CalendarCheck,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Clock,
} from "lucide-react";

const features = [
    {
        icon: CalendarCheck,
        title: "Easy Online Booking",
        description:
            "Choose your preferred service, date and available time slot without any hassle.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Online Payments",
        description:
            "Complete your confirmed appointments through a secure online payment process.",
    },
    {
        icon: Clock,
        title: "Convenient Scheduling",
        description:
            "Explore available services and manage your appointments from one place.",
    },
    {
        icon: CheckCircle2,
        title: "Appointment Management",
        description:
            "Keep track of your appointment requests and payment status through your dashboard.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-background px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

                {/* Image Section */}
                <div className="relative">
                    <div className="relative h-[380px] overflow-hidden rounded-3xl sm:h-[480px]">
                        <Image
                            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=85&w=1200"
                            alt="Professional salon beauty treatment"
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Floating Card */}
                    <div className="absolute -bottom-6 -right-2 rounded-2xl border bg-card p-5 shadow-xl sm:-right-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <Sparkles size={23} />
                            </div>

                            <div>
                                <p className="font-bold">
                                    Your Beauty Matters
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Every detail, every experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pt-5 lg:pt-0">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                        Why Choose SalonBook
                    </span>

                    <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        Your Beauty Journey,
                        <span className="text-rose-500">
                            {" "}Made Simple.
                        </span>
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                        We make discovering and booking salon services
                        simple and convenient. Find the right service,
                        choose your preferred time, and book your next
                        beauty experience with confidence.
                    </p>

                    {/* Features */}
                    <div className="mt-8 space-y-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="flex items-start gap-4"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
                                        <Icon size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <Link
                        href="/services"
                        className="mt-9 inline-flex items-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                        Explore Our Services
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </div>
        </section>
    );
}