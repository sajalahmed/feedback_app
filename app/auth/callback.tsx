import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "@/src/features/auth/useAuth";

export default function AuthCallback() {
    const router = useRouter();
    const { token: paramToken } = useLocalSearchParams<{ token?: string }>();
    const { authToken, isAuthenticating, verifyLoginToken } = useAuth();
    const calledRef = useRef(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function verify() {
            if (calledRef.current) return;

            let token = paramToken;

            // Fallback: parse the URL that launched the app if params are empty
            if (!token) {
                try {
                    const url = await Linking.getInitialURL();
                    if (url) {
                        const parsed = Linking.parse(url);
                        token = parsed.queryParams?.token as
                            | string
                            | undefined;
                    }
                } catch {
                    // getInitialURL can fail in some environments — ignore
                }
            }

            if (!token) return; // Wait for token to be available

            calledRef.current = true;

            try {
                await verifyLoginToken(token);
            } catch (e) {
                setError(
                    e instanceof Error ? e.message : "Authentication failed.",
                );
            }
        }

        verify();
    }, [paramToken, verifyLoginToken]);

    // Navigate home once auth succeeds
    useEffect(() => {
        if (authToken && !error) {
            router.replace("/");
        }
    }, [authToken, error, router]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                    style={styles.retryButton}
                    onPress={() => router.replace("/")}
                >
                    <Text style={styles.retryText}>Go to Login</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0b3a5b" />
            <Text style={styles.text}>
                {isAuthenticating
                    ? "Signing you in..."
                    : "Finishing authentication..."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f7fb",
        gap: 12,
    },
    text: {
        color: "#415164",
        fontSize: 14,
    },
    errorText: {
        color: "#c0392b",
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 32,
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "#0b3a5b",
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});
