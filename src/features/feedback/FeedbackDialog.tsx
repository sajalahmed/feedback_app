import React, { useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";

import { submitFeedback } from "@/src/shared/api/api";
import { BottomSheet } from "@/src/shared/components/BottomSheet";
import { PrimaryButton } from "@/src/shared/components/PrimaryButton";
import { TextInputField } from "@/src/shared/components/TextInputField";
import { storage } from "@/src/shared/storage/storage";

type FeedbackDialogProps = {
    visible: boolean;
    authToken: string;
    onClose: () => void;
};

export function FeedbackDialog({
    visible,
    authToken,
    onClose,
}: FeedbackDialogProps) {
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmitFeedback = async () => {
        if (!feedback.trim()) return;

        Keyboard.dismiss();
        setIsSubmitting(true);
        setError(null);

        try {
            await submitFeedback(authToken, feedback.trim());
            await storage.markFeedbackSubmitted();
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to send feedback.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <View style={styles.handle} />
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
    inputSection: {
        gap: 10,
    },
    errorText: {
        color: "red",
        fontSize: 14,
    },
});
