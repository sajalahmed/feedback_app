import { API_BASE_URL } from "@/src/shared/constants/config";

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

// ── Types ──────────────────────────────────────────────────────────────

export type LoginResponse = { message?: string };
export type VerifyResponse = { token: string };

// ── Helpers ────────────────────────────────────────────────────────────

function handleNetworkError(error: unknown): never {
    if (error instanceof Error && error.message.includes("Network")) {
        throw new Error("Network request failed. Check Wi-Fi and backend IP.");
    }
    throw error;
}

// ── Auth ───────────────────────────────────────────────────────────────

export async function requestLogin(email: string): Promise<LoginResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers,
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Unable to send login link. Please try again.");
        return res.json();
    } catch (error) {
        handleNetworkError(error);
    }
}

export async function verifyLoginToken(token: string): Promise<VerifyResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/session`, {
            method: "POST",
            headers,
            body: JSON.stringify({ token }),
        });
        if (!res.ok) throw new Error("This login link is invalid or expired.");
        return res.json();
    } catch (error) {
        handleNetworkError(error);
    }
}

// ── Feedback ───────────────────────────────────────────────────────────

export async function submitFeedback(
    authToken: string,
    content: string,
): Promise<void> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/feedback`, {
            method: "POST",
            headers: { ...headers, Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error("Unable to send feedback. Please try again.");
    } catch (error) {
        handleNetworkError(error);
    }
}
