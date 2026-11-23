
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <section className="overflow-hidden bg-[#FFF9F6]">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">

                {/* Left Content */}
                <div className="space-y-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600">
                        <Sparkles size={16} />
                        Your Beauty, Our Passion
                    </div>

                    <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Discover Your
                        <span className="block text-primary">
                            Beauty & Confidence
                        </span>
                        With SalonBook.
                    </h1>

                    <p className="max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
                        Experience exceptional salon services with ease.
                        Discover your favorite treatments and book your next
                        appointment in just a few clicks.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/services"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                        >
                            Explore Salon Services
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/sign-up"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 px-7 text-sm font-medium text-gray-800 transition hover:bg-rose-50"
                        >
                            Get Started
                        </Link>
                    </div>
                    
                    <div className="flex flex-wrap gap-8 border-t border-rose-100 pt-7">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">20+</h3>
                            <p className="text-sm text-gray-500">Beauty Services</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Easy</h3>
                            <p className="text-sm text-gray-500">Online Booking</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                            <p className="text-sm text-gray-500">Online Access</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-rose-200/50 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
                        <Image
                            src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
                            alt="Elegant modern beauty salon interior"
                            width={700}
                            height={800}
                            priority
                            className="h-[400px] w-full object-cover sm:h-[500px]"
                        />
                    </div>

                    <div className="absolute -bottom-5 -left-5 rounded-2xl border bg-white p-5 shadow-lg sm:-left-8">
                        <p className="text-sm font-medium text-gray-500">
                            Your Beauty Journey
                        </p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                            Starts Here ✨
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
