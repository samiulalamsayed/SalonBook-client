"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
    User,
    Mail,
    Lock,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Upload,
    X,
} from "lucide-react";

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
    const [showPassword, setShowPassword] = useState(false);

    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
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

    const imageUrl = watch("image");

    // Profile Picture Selection
    const handleImageChange = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setValue("image", "");
    };

    // Remove Profile Picture
    const removeImage = () => {
        setSelectedFile(null);
        setPreviewImage("");
        setValue("image", "");
    };

    // Upload Image to Backend
    const uploadProfileImage = async () => {
        if (!selectedFile) return imageUrl || undefined;

        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Image upload failed.");
        }

        if (!result.imageUrl) {
            throw new Error("Image URL was not returned by the server.");
        }

        return result.imageUrl as string;
    };

    // Email Sign Up
    const onSubmit = async (values: RegisterFormValues) => {
        try {
            setIsLoading(true);

            const profileImage = await uploadProfileImage();

            const { error } = await registerWithEmail({
                ...values,
                image: profileImage || undefined,
            });

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
                    : "Sign up failed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Google Sign Up
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-black"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                aria-label={showPassword ? "Hide password" : "Show password"}
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

                        <p className="mt-1 text-xs text-gray-400">
                            Minimum 6 characters, including uppercase and lowercase letters.
                        </p>
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Profile Picture
                            <span className="ml-1 text-gray-400">(Optional)</span>
                        </label>

                        {/* Image Options */}
                        <div className="mb-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageMode("upload");
                                    removeImage();
                                }}
                                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${imageMode === "upload"
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Upload size={15} className="mr-2 inline" />
                                Upload Image
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setImageMode("url");
                                    removeImage();
                                }}
                                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${imageMode === "url"
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <ImageIcon size={15} className="mr-2 inline" />
                                Image URL
                            </button>
                        </div>

                        {/* Upload Option */}
                        {imageMode === "upload" && (
                            <div>
                                {!previewImage ? (
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-7 text-center transition hover:border-black">
                                        <Upload size={25} className="mb-2 text-gray-400" />

                                        <span className="text-sm font-medium text-gray-700">
                                            Click to upload a profile picture
                                        </span>

                                        <span className="mt-1 text-xs text-gray-400">
                                            PNG, JPG or WEBP (Max 5MB)
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(e.target.files?.[0])
                                            }
                                        />
                                    </label>
                                ) : (
                                    <div className="relative mx-auto w-fit">
                                        <img
                                            src={previewImage}
                                            alt="Profile preview"
                                            className="h-24 w-24 rounded-full border object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                                            aria-label="Remove image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* URL Option */}
                        {imageMode === "url" && (
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

                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="Profile preview"
                                        className="mt-3 h-20 w-20 rounded-full border object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}

                                {errors.image && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
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

                {/* Google Sign Up */}
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
