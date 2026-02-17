import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type PrimaryButtonProps = {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

export function PrimaryButton({
    label,
    onPress,
    disabled = false,
    loading = false,
}: PrimaryButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                isDisabled && styles.disabled,
                pressed && !isDisabled && styles.pressed,
            ]}
        >
            <View style={styles.content}>
                {loading ? <ActivityIndicator color="#ffffff" /> : null}
                <Text style={styles.label}>{label}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#0b3a5b",
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    disabled: {
        backgroundColor: "#9bb1c1",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    label: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});
