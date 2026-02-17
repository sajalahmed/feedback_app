import React from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type BottomSheetProps = {
    visible: boolean;
    onClose?: () => void;
    children: React.ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.wrapper}
                behavior={Platform.select({ ios: "padding", android: undefined })}
            >
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.sheet}>
                    {onClose ? (
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </Pressable>
                    ) : null}
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(9, 15, 35, 0.4)",
    },
    sheet: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 28,
        maxHeight: "85%",
    },
    closeButton: {
        position: "absolute",
        top: 14,
        right: 18,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f0f3f7",
        alignItems: "center",
        justifyContent: "center",
    },
    closeIcon: {
        fontSize: 16,
        color: "#415164",
        fontWeight: "600",
    },
});
