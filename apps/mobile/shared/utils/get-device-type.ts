import { Platform } from "react-native";
import type { DeviceType } from "../../features/auth/api/auth.types";

export function getDeviceType(): DeviceType {
  switch (Platform.OS) {
    case "ios":
      return "IOS";
    case "android":
      return "ANDROID";
    default:
      return "WEB";
  }
}
