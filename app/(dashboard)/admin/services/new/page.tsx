"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ImagePlus,
    Upload,
    X,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

const categories = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

const AddServicePage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        duration: "",
        status: "active",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Input Changes
    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Handle Image Selection
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and WEBP images are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            event.target.value = "";
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Upload Image to ImgBB
    const uploadImage = async () => {
        if (!imageFile) {
            throw new Error("Please select a service image.");
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const token = await getAccessToken();

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

    // Submit Form
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!imageFile) {
            toast.error("Please upload a service image.");
            return;
        }

        const price = Number(formData.price);
        const duration = Number(formData.duration);

        if (!Number.isFinite(price) || price <= 0) {
            toast.error("Price must be a positive number.");
            return;
        }

        if (!Number.isInteger(duration) || duration <= 0) {
            toast.error("Duration must be a positive whole number.");
            return;
        }

        if (formData.name.trim().length < 2) {
            toast.error("Service name must be at least 2 characters.");
            return;
        }

        if (formData.description.trim().length < 10) {
            toast.error("Description must be at least 10 characters.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Upload Image First
            const imageUrl = await uploadImage();

            // Create Service
            const result = await apiFetch("/api/services", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name.trim(),
                    category: formData.category,
                    description: formData.description.trim(),
                    price,
                    duration,
                    image: imageUrl,
                    status: formData.status,
                }),
            });

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to create service."
                );
            }

            toast.success("Service created successfully!");

            router.push("/admin/services");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/services"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    Back to Services
                </Link>

                <h1 className="mt-4 text-2xl font-bold tracking-tight">
                    Add New Service
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Add a new salon service to your service collection.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border bg-background p-5 sm:p-7"
            >
                {/* Basic Information */}
                <div>
                    <h2 className="text-lg font-semibold">
                        Service Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Provide the basic details of your salon service.
                    </p>
                </div>

                {/* Service Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium"
                    >
                        Service Name *
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        placeholder="e.g. Premium Haircut"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label
                        htmlFor="category"
                        className="text-sm font-medium"
                    >
                        Service Category *
                    </label>

                    <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                    >
                        <option value="" disabled>
                            Select a category
                        </option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Description *
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        required
                        minLength={10}
                        rows={5}
                        placeholder="Describe the service..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full resize-y rounded-lg border bg-background p-4 text-sm outline-none focus:border-primary"
                    />

                    <p className="text-xs text-muted-foreground">
                        Minimum 10 characters.
                    </p>
                </div>

                {/* Price and Duration */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium"
                        >
                            Price (BDT) *
                        </label>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="e.g. 1500"
                            value={formData.price}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="duration"
                            className="text-sm font-medium"
                        >
                            Estimated Duration (Minutes) *
                        </label>

                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            required
                            min="1"
                            step="1"
                            placeholder="e.g. 45"
                            value={formData.duration}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium">
                            Service Image *
                        </label>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Upload JPG, PNG or WEBP image. Maximum size 5MB.
                        </p>
                    </div>

                    {imagePreview ? (
                        <div className="relative h-56 w-full overflow-hidden rounded-xl border bg-muted sm:w-80">
                            <Image
                                src={imagePreview}
                                alt="Service preview"
                                fill
                                unoptimized
                                className="object-cover"
                            />

                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black"
                                aria-label="Remove image"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="image"
                            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 px-5 py-8 text-center transition-colors hover:border-primary hover:bg-muted/40"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <ImagePlus size={27} />
                            </div>

                            <p className="mt-4 text-sm font-semibold">
                                Click to upload image
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                JPG, PNG or WEBP (Maximum 5MB)
                            </p>

                            <input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}

                    {imagePreview && (
                        <button
                            type="button"
                            onClick={() =>
                                document.getElementById("image")?.click()
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            <Upload size={16} />
                            Change Image
                        </button>
                    )}

                    {imagePreview && (
                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label
                        htmlFor="status"
                        className="text-sm font-medium"
                    >
                        Service Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-primary"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <p className="text-xs text-muted-foreground">
                        Only active services will be visible to customers.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                    <Link
                        href="/admin/services"
                        className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting || isUploading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                                {isUploading
                                    ? "Uploading Image..."
                                    : "Creating Service..."}
                            </>
                        ) : (
                            <>
                                <Upload size={17} />
                                Create Service
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddServicePage;