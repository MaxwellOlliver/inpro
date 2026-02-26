import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth.api";
import { useAuth } from "../context/auth.context";
import type { UserProfile } from "../api/auth.types";

const DEFAULT_AVATAR_URL =
  "https://preview.redd.it/the-many-facial-expressions-of-klein-moretti-donghua-v0-8655d6zdnwdf1.png?width=486&format=png&auto=webp&s=3f4e28bc41f56f37a997e72505dccd9fa96abbf7";

const DEFAULT_BANNER_URL =
  "https://preview.redd.it/lotm-general-which-depiction-of-the-gray-fog-is-more-v0-zkgvie4nezkf1.png?width=640&crop=smart&auto=webp&s=9c56fc26001785e4f365cadeb6c1560a4ef10c31";

export const profileQueryKey = ["profile"] as const;

export function useProfileQuery() {
  const { status } = useAuth();

  return useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const profile = await getProfile();
      if (!profile.avatarUrl) {
        profile.avatarUrl = DEFAULT_AVATAR_URL;
      }
      if (!profile.bannerUrl) {
        profile.bannerUrl = DEFAULT_BANNER_URL;
      }
      return profile;
    },
    enabled: status === "authenticated",
    gcTime: Infinity,
  });
}

/**
 * Returns cached profile data, never undefined after first fetch.
 * Use this in screens that expect profile to always exist.
 */
export function useProfile(): UserProfile {
  const { data } = useProfileQuery();
  if (!data) {
    throw new Error("useProfile called before profile was fetched");
  }
  return data;
}
