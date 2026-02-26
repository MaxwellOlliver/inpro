import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api/auth.api";
import { useAuth } from "../context/auth.context";
import { getDeviceType } from "../../../shared/utils/get-device-type";
import { getDeviceId } from "../../../shared/utils/get-device-id";

export function useSignIn() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const device = getDeviceType();
      const deviceId = await getDeviceId();
      return signIn({ ...data, device, deviceId });
    },
    onSuccess: async (response) => {
      await login(response);
    },
  });
}
