import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TextInputFieldProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
};

export function TextInputField({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
}: TextInputFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.multiline]}
                placeholder={placeholder}
                placeholderTextColor="#91a2b2"
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                textAlignVertical={multiline ? "top" : "center"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        color: "#0f172a",
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#d9e2ea",
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#0f172a",
        backgroundColor: "#f8fafc",
    },
    multiline: {
        minHeight: 120,
    },
});
