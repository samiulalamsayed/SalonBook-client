"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    User,
    Mail,
    Phone,
    Camera,
    Loader2,
    Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/components/providers/auth-provider";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function ProfileForm() {
    const { data: session, isPending } = useAuth();
    const user = session?.user;

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhoneNumber(user.phoneNumber || "");
            setImage(user.image || "");
            setPreview(user.image || "");
        }
    }, [user]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Please select a JPG, PNG or WEBP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!selectedFile) return image;

        setIsUploading(true);

        try {
            const token = await getAccessToken();
            const formData = new FormData();

            formData.append("image", selectedFile);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success || !result.imageUrl) {
                throw new Error(
                    result.message || "Image upload failed."
                );
            }

            return result.imageUrl as string;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required.");
            return;
        }

        try {
            setIsSaving(true);

            const uploadedImage = await uploadImage();

            const result = await apiFetch("/api/users/profile/me", {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    image: uploadedImage,
                    phoneNumber: phoneNumber.trim(),
                }),
            });

            setImage(result.data.image || "");
            setPreview(result.data.image || "");
            setSelectedFile(null);

            toast.success("Profile updated successfully.");

            // Refresh session-dependent Navbar and Header information.
            window.location.reload();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile."
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={30} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                Unable to load your profile. Please Sign In again.
            </div>
        );
    }

    const isBusy = isSaving || isUploading;

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Profile
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal information and profile picture.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-xl border bg-card"
            >
                {/* Profile Image */}
                <div className="border-b p-6 sm:p-8">
                    <h2 className="font-semibold">Profile Picture</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Upload a JPG, PNG or WEBP image (maximum 5MB).
                    </p>

                    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile preview"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="112px"
                                />
                            ) : (
                                <User
                                    size={42}
                                    className="text-muted-foreground"
                                />
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="profile-image"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                            >
                                <Camera size={16} />
                                Change Picture
                            </label>

                            <input
                                id="profile-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <p className="mt-2 text-xs text-muted-foreground">
                                Recommended: Square image.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-5 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Update your account details.
                        </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Enter your name"
                                required
                                disabled={isBusy}
                                className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="email"
                                type="email"
                                value={user.email || ""}
                                readOnly
                                className="w-full cursor-not-allowed rounded-lg border bg-muted/50 py-3 pl-10 pr-4 text-sm text-muted-foreground outline-none"
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Email address cannot be changed here.
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium"
                        >
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(event) =>
                                    setPhoneNumber(event.target.value)
                                }
                                placeholder="Enter your phone number"
                                disabled={isBusy}
                                className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="rounded-lg bg-muted/40 p-4">
                        <p className="text-xs text-muted-foreground">
                            Account Role
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize">
                            {user.role || "Customer"}
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end border-t pt-5">
                        <button
                            type="submit"
                            disabled={isBusy || !name.trim()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isBusy ? (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <Save size={17} />
                            )}

                            {isUploading
                                ? "Uploading Image..."
                                : isSaving
                                    ? "Saving..."
                                    : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}