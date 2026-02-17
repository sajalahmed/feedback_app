import AsyncStorage from "@react-native-async-storage/async-storage";

const FEEDBACK_DONE_KEY = "feedback.submitted";
const ONBOARDING_DONE_KEY = "onboarding.done";

export const storage = {
    async get(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key);
    },

    async set(key: string, value: string): Promise<void> {
        await AsyncStorage.setItem(key, value);
    },

    async remove(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    },

    async hasFeedbackBeenSubmitted(): Promise<boolean> {
        const value = await AsyncStorage.getItem(FEEDBACK_DONE_KEY);
        return value === "true";
    },

    async markFeedbackSubmitted(): Promise<void> {
        await AsyncStorage.setItem(FEEDBACK_DONE_KEY, "true");
    },

    async hasOnboardingBeenShown(): Promise<boolean> {
        const value = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
        return value === "true";
    },

    async markOnboardingShown(): Promise<void> {
        await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "true");
    },
};
