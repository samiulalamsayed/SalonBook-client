import { authClient } from "./auth-client";
import type {
    LoginFormValues,
    RegisterFormValues,
} from "./validations/auth.schema";

// Email Login
export const loginWithEmail = (values: LoginFormValues) => {
    return authClient.signIn.email({
        email: values.email,
        password: values.password,
    });
};

// Email Registration
export const registerWithEmail = (values: RegisterFormValues) => {
    return authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image || undefined,
    });
};

// Google Login
export const loginWithGoogle = () => {
    return authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
};

// Logout
export const logout = () => {
    return authClient.signOut();
};

// Get JWT Access Token
export const getAccessToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error("Unable to retrieve access token.");
    }

    return data.token;
};