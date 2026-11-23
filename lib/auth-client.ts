import { createAuthClient } from "better-auth/react";
import {
    jwtClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

    fetchOptions: {
        credentials: "include",
    },

    sessionOptions: {
        refetchOnWindowFocus: true,
        refetchInterval: 0,
        refetchWhenOffline: false,
    },

    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                    input: false,
                },
                isBlocked: {
                    type: "boolean",
                    input: false,
                },
                phoneNumber: {
                    type: "string",
                    required: false,
                },
            },
        }),

        jwtClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;