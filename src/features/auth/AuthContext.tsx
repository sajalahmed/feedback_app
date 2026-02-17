import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { requestLogin, verifyLoginToken } from "@/src/shared/api/api";
import { storage } from "@/src/shared/storage/storage";

const AUTH_TOKEN_KEY = "auth.token";
const AUTH_EMAIL_KEY = "auth.email";
const PENDING_EMAIL_KEY = "auth.pending.email";

type AuthContextValue = {
    authToken: string | null;
    email: string | null;
    isLoading: boolean;
    isAuthenticating: boolean;
    requestLogin: (email: string) => Promise<string | null>;
    verifyLoginToken: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Restore saved session from AsyncStorage on mount
    const restoreSession = useCallback(async () => {
        const savedToken = await storage.get(AUTH_TOKEN_KEY);
        const savedEmail = await storage.get(AUTH_EMAIL_KEY);
        setAuthToken(savedToken);
        setEmail(savedEmail);
        setIsLoading(false);
    }, []);

    const requestLoginLink = useCallback(async (userEmail: string) => {
        const response = await requestLogin(userEmail);
        await storage.set(PENDING_EMAIL_KEY, userEmail);
        return response.message ?? null;
    }, []);

    // Called ONLY from the /auth/callback route — not on every app open
    const verifyLinkToken = useCallback(async (token: string) => {
        setIsAuthenticating(true);
        try {
            const response = await verifyLoginToken(token);
            await storage.set(AUTH_TOKEN_KEY, response.token);
            const pendingEmail = await storage.get(PENDING_EMAIL_KEY);
            if (pendingEmail) {
                await storage.set(AUTH_EMAIL_KEY, pendingEmail);
                await storage.remove(PENDING_EMAIL_KEY);
                setEmail(pendingEmail);
            }
            setAuthToken(response.token);
        } catch (error) {
            // Re-throw so the callback screen can display the error
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setAuthToken(null);
        setEmail(null);
        await storage.remove(AUTH_TOKEN_KEY);
        await storage.remove(AUTH_EMAIL_KEY);
        await storage.remove(PENDING_EMAIL_KEY);
        // Clear onboarding so it shows again on next login.
        // Feedback flag stays — once given, never asked again.
        await storage.remove("onboarding.done");
    }, []);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    const value = useMemo<AuthContextValue>(
        () => ({
            authToken,
            email,
            isLoading,
            isAuthenticating,
            requestLogin: requestLoginLink,
            verifyLoginToken: verifyLinkToken,
            logout,
        }),
        [
            authToken,
            email,
            isLoading,
            isAuthenticating,
            requestLoginLink,
            verifyLinkToken,
            logout,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
