import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    // Send session cookies with requests
    fetchOptions: {
        credentials: "include",
    },

    // Session Management
    sessionOptions: {
        refetchOnWindowFocus: true,
        refetchInterval: 0,
        refetchWhenOffline: false,
    },

    plugins: [
        jwtClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;