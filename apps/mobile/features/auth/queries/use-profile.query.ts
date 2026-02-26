import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth.api";
import { useAuth } from "../context/auth.context";

export function useProfileQuery() {
  const { status, setProfile } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await getProfile();
      setProfile(profile);
      return profile;
    },
    enabled: status === "authenticated",
  });
}
