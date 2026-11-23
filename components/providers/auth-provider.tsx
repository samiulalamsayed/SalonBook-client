"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client";

const AuthContext = createContext<ReturnType<typeof useSession> | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = useSession();

    return (
        <AuthContext.Provider value={session}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}