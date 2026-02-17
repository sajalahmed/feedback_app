import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/src/features/auth/useAuth";
import { PrimaryButton } from "@/src/shared/components/PrimaryButton";
import { TextInputField } from "@/src/shared/components/TextInputField";

export function LoginScreen() {
    const { requestLogin, isAuthenticating } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendLink = async () => {
        if (!email.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const res = await requestLogin(email.trim());
            setMessage(res ?? "Check your inbox for the secure login link.");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to send login link.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.hero} />
            <View style={styles.card}>
                <Text style={styles.title}>Sign in with Email</Text>
                <Text style={styles.subtitle}>
                    We will email you a secure link to finish logging in.
                </Text>

                <TextInputField
                    label="Work email"
                    placeholder="email@gialoo.com"
                    value={email}
                    onChangeText={setEmail}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {message ? <Text style={styles.successText}>{message}</Text> : null}

                <PrimaryButton
                    label={isSubmitting ? "Sending..." : "Send login link"}
                    onPress={handleSendLink}
                    disabled={!email.trim()}
                    loading={isSubmitting}
                />

                {isAuthenticating ? (
                    <View style={styles.inlineStatus}>
                        <ActivityIndicator color="#0b3a5b" />
                        <Text style={styles.statusText}>Signing you in...</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef2f8",
        justifyContent: "center",
        padding: 24,
    },
    hero: {
        position: "absolute",
        width: 320,
        height: 320,
        backgroundColor: "#fce4c6",
        borderRadius: 160,
        top: -60,
        right: -80,
        opacity: 0.6,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        gap: 16,
        shadowColor: "#0f172a",
        shadowOpacity: 0.1,
        shadowRadius: 18,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0f172a",
    },
    subtitle: {
        fontSize: 15,
        color: "#526279",
        lineHeight: 22,
    },
    errorText: {
        color: "#b42318",
        fontSize: 13,
    },
    successText: {
        color: "#0f6f4a",
        fontSize: 13,
    },
    inlineStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusText: {
        color: "#3d4f65",
        fontSize: 13,
    },
});
