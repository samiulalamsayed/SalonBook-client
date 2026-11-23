"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import {
    loginSchema,
    type LoginFormValues,
} from "@/lib/validations/auth.schema";

import {
    loginWithEmail,
    loginWithGoogle,
} from "@/lib/auth";

export default function SignInPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Email Sign In
    const onSubmit = async (values: LoginFormValues) => {
        try {
            setIsLoading(true);

            const { data, error } = await loginWithEmail(values);

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Signed in successfully!");

            const role = data?.user?.role;

            if (role === "admin") {
                router.replace("/admin");
            } else if (role === "customer") {
                router.replace("/customer");
            } else {
                router.replace("/");
            }

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Sign in failed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);

            const { error } = await loginWithGoogle();

            if (error) {
                toast.error(error.message);
                setIsGoogleLoading(false);
            }
        } catch {
            toast.error("Google sign in failed.");
            setIsGoogleLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue to SalonBook.
                    </p>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-black"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
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

                {/* Google Sign In */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
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

                {/* Sign Up Link */}
                <p className="mt-7 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-black hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

            </div>
        </main>
    );
}
