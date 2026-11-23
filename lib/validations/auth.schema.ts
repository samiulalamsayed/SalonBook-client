import { z } from "zod";

// Login Validation
export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

// Registration Validation
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Full name must be at least 2 characters"),

    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter"),

    image: z
        .string()
        .url("Please enter a valid image URL")
        .optional()
        .or(z.literal("")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;