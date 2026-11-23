import { getAccessToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = await getAccessToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};