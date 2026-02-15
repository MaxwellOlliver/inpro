import { useMutation } from "@tanstack/react-query";
import { signOut } from "../api/auth.api";
import { useAuth } from "../context/auth.context";

export function useSignOut() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: signOut,
    onSettled: async () => {
      await logout();
    },
  });
}
