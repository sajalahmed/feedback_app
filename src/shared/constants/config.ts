import { Platform } from "react-native";

const DEV_HOST = "http://10.56.83.145:8001";

export const API_BASE_URL = Platform.select({
    android: DEV_HOST,
    ios: DEV_HOST,
    default: DEV_HOST,
});

export const APP_STORE_URL = "https://apps.apple.com/app/id000000000";
export const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.example.feedback";
