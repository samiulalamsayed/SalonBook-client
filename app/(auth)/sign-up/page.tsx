"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { User, Mail, Lock, Image as ImageIcon } from "lucide-react";

import {
    registerSchema,
    type RegisterFormValues,
} from "@/lib/validations/auth.schema";

import {
    registerWithEmail,
    loginWithGoogle,
} from "@/lib/auth";

export default function SignupPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: "",
        },
    });

    // Email Registration
    const onSubmit = async (values: RegisterFormValues) => {
        try {
            setIsLoading(true);

            const { error } = await registerWithEmail(values);

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Account created successfully!");

            router.push("/customer");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Registration failed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Google Registration
    const handleGoogleSignup = async () => {
        try {
            setIsGoogleLoading(true);

            const { error } = await loginWithGoogle();

            if (error) {
                toast.error(error.message);
                setIsGoogleLoading(false);
            }
        } catch {
            toast.error("Google sign up failed.");
            setIsGoogleLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Join SalonBook and book your favorite salon services.
                    </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                {...register("email")}
                                type="email"
                                placeholder="example@email.com"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                            Minimum 6 characters, including uppercase and lowercase letters.
                        </p>
                    </div>

                    {/* Profile Image URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Profile Image URL
                            <span className="ml-1 text-gray-400">
                                (Optional)
                            </span>
                        </label>

                        <div className="relative">
                            <ImageIcon
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                {...register("image")}
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        {errors.image && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>

                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-sm text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Signup */}
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading || isGoogleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.02 13.22l7.98 6.19C12.9 13.72 18.02 9.5 24 9.5Z"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.78 7.18l7.73 6C44.4 37.9 46.98 31.8 46.98 24.55Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.99 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.17 2.3-5.98 0-11.1-4.22-13-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                        />
                    </svg>

                    {isGoogleLoading
                        ? "Connecting to Google..."
                        : "Continue with Google"}
                </button>

                {/* Sign In Link */}
                <p className="mt-7 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-semibold text-black hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

            </div>
        </main>
    );
}
