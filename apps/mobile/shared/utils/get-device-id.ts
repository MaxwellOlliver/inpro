import { Platform } from "react-native";
import * as Application from "expo-application";

export async function getDeviceId(): Promise<string> {
  if (Platform.OS === "android") {
    return Application.getAndroidId() ?? "unknown";
  }
  if (Platform.OS === "ios") {
    return (await Application.getIosIdForVendorAsync()) ?? "unknown";
  }
  return "web";
}
