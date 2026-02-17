import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { LoginScreen } from "@/src/features/auth/LoginScreen";
import { useAuth } from "@/src/features/auth/useAuth";
import { HomeScreen } from "@/src/features/home/HomeScreen";

export default function Index() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0b3a5b" />
      </View>
    );
  }

  return authToken ? <HomeScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fb",
  },
});
