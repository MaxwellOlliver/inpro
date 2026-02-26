import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../api/auth.api";
import { useAuth } from "../context/auth.context";
import { profileQueryKey } from "../queries/use-profile.query";

export function useSignOut() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: profileQueryKey });
      await logout();
    },
  });
}
