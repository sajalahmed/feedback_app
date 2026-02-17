import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/src/features/auth/useAuth";
import { OnboardingFlow } from "@/src/features/onboarding/OnboardingFlow";
import { PrimaryButton } from "@/src/shared/components/PrimaryButton";
import { storage } from "@/src/shared/storage/storage";

export function HomeScreen() {
    const { authToken, email, logout } = useAuth();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        const check = async () => {
            if (!authToken) return;

            const onboardingDone = await storage.hasOnboardingBeenShown();
            if (mounted) {
                setShowOnboarding(!onboardingDone);
                setIsChecking(false);
            }
        };

        check();
        return () => {
            mounted = false;
        };
    }, [authToken]);

    const handleOnboardingComplete = async () => {
        await storage.markOnboardingShown();
        setShowOnboarding(false);
    };

    if (!authToken) return null;

    return (
        <View style={styles.container}>
            <View style={styles.heroBackground} />
            <View style={styles.heroGlow} />

            <View style={styles.content}>
                <Text style={styles.kicker}>Feedback Studio</Text>
                <Text style={styles.title}>
                    Feedback
                </Text>
                <Text style={styles.subtitle}>
                    "LOGO HERE"
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Signed in</Text>
                    <Text style={styles.cardText}>
                        {email ?? "Your session is active."}
                    </Text>
                    <PrimaryButton label="Log out" onPress={logout} />
                </View>
            </View>

            {authToken && !isChecking ? (
                <OnboardingFlow
                    visible={showOnboarding}
                    authToken={authToken}
                    onComplete={handleOnboardingComplete}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7fb",
    },
    heroBackground: {
        position: "absolute",
        width: "120%",
        height: 280,
        backgroundColor: "#cfe5f5",
        borderBottomLeftRadius: 220,
        borderBottomRightRadius: 220,
        top: -80,
        left: "-10%",
    },
    heroGlow: {
        position: "absolute",
        width: 220,
        height: 220,
        backgroundColor: "#ffe6b1",
        opacity: 0.5,
        borderRadius: 120,
        top: 120,
        right: -40,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 80,
        gap: 18,
    },
    kicker: {
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: "#3c5a73",
        fontSize: 12,
        fontWeight: "600",
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#0f172a",
    },
    subtitle: {
        fontSize: 16,
        color: "#4b5d70",
        lineHeight: 22,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        gap: 12,
        shadowColor: "#0f172a",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0f172a",
    },
    cardText: {
        fontSize: 14,
        color: "#516075",
    },
});
