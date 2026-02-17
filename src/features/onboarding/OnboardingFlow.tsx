import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, Text, View } from "react-native";

import { submitFeedback } from "@/src/shared/api/api";
import { BottomSheet } from "@/src/shared/components/BottomSheet";
import { PrimaryButton } from "@/src/shared/components/PrimaryButton";
import { TextInputField } from "@/src/shared/components/TextInputField";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/src/shared/constants/config";
import { storage } from "@/src/shared/storage/storage";

type OnboardingFlowProps = {
    visible: boolean;
    authToken: string;
    onComplete: () => void;
};

type Step = "initial" | "feedback" | "review";

export function OnboardingFlow({
    visible,
    authToken,
    onComplete,
}: OnboardingFlowProps) {
    const [step, setStep] = useState<Step>("initial");
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when visibility changes
    useEffect(() => {
        if (visible) {
            setStep("initial");
            setFeedback("");
            setError(null);
            setIsSubmitting(false);
        }
    }, [visible]);

    const handleNotYet = () => {
        setStep("feedback");
    };

    const handleLovingIt = () => {
        setStep("review");
    };

    const handleSubmitFeedback = async () => {
        if (!feedback.trim()) return;

        Keyboard.dismiss();
        setIsSubmitting(true);
        setError(null);

        try {
            await submitFeedback(authToken, feedback.trim());
            await storage.markFeedbackSubmitted();
            onComplete();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to send feedback.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenStore = async () => {
        const url = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
        await Linking.openURL(url);
        onComplete();
    };

    return (
        <BottomSheet visible={visible} onClose={onComplete}>
            <View style={styles.handle} />

            {step === "initial" ? (
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>RIZON</Text>
                        </View>
                        <Text style={styles.h1}>Enjoying Rizon so far?</Text>
                        <Text style={styles.p}>
                            Your feedback helps us build a better money experience
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <View style={styles.flex1}>
                            <PrimaryButton label="Not Yet" onPress={handleNotYet} />
                        </View>
                        <View style={styles.flex1}>
                            <PrimaryButton label="Yes, Loving it" onPress={handleLovingIt} />
                        </View>
                    </View>
                </View>
            ) : null}

            {step === "feedback" ? (
                <View style={styles.content}>
                    <Text style={styles.h1}>Help us improve Rizon</Text>
                    <Text style={styles.p}>
                        Tell us what didn't feel right, we read every message.
                    </Text>

                    <View style={styles.inputSection}>
                        <TextInputField
                            label="Your feedback"
                            placeholder="Tell us what we can improve..."
                            value={feedback}
                            onChangeText={setFeedback}
                            multiline
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    <PrimaryButton
                        label="Submit Feedback"
                        onPress={handleSubmitFeedback}
                        loading={isSubmitting}
                        disabled={!feedback.trim()}
                    />
                </View>
            ) : null}

            {step === "review" ? (
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Rate us!</Text>
                    <Text style={styles.p}>
                        We're glad you're enjoying Rizon. Please take a moment to rate us on the
                        store.
                    </Text>

                    <PrimaryButton label="Open Store" onPress={handleOpenStore} />
                </View>
            ) : null}
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    handle: {
        alignSelf: "center",
        width: 46,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#d5dde6",
        marginBottom: 18,
    },
    content: {
        gap: 20,
        paddingBottom: 20,
    },
    header: {
        alignItems: "center",
        gap: 12,
    },
    logoContainer: {
        width: 60,
        height: 60,
        backgroundColor: "#0f172a",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    logoText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    h1: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
    },
    p: {
        fontSize: 16,
        lineHeight: 24,
        color: "#415164",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },
    flex1: {
        flex: 1,
    },
    inputSection: {
        gap: 10,
    },
    errorText: {
        color: "#b42318",
        fontSize: 13,
    },
});
