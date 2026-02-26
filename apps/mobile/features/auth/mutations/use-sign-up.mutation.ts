import { useMutation } from "@tanstack/react-query";
import { registerUser, signIn } from "../api/auth.api";
import type { RegisterRequest } from "../api/auth.types";
import { useAuth } from "../context/auth.context";
import { getDeviceType } from "../../../shared/utils/get-device-type";
import { getDeviceId } from "../../../shared/utils/get-device-id";

export function useSignUp() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await registerUser(data);

      const device = getDeviceType();
      const deviceId = await getDeviceId();

      return signIn({
        email: data.email,
        password: data.password,
        device,
        deviceId,
      });
    },
    onSuccess: async (response) => {
      await login(response.tokens, response.user, response.profile);
    },
  });
}
