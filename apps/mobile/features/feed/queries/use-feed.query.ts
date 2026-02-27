import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/context/auth.context";
import { getFeedPosts, type FeedPage } from "../api/feed.api";

export const feedQueryKey = ["feed"] as const;

export function useFeedQuery() {
  const { status } = useAuth();

  return useInfiniteQuery<
    FeedPage,
    Error,
    InfiniteData<FeedPage, unknown>,
    readonly ["feed"],
    string | undefined
  >({
    queryKey: feedQueryKey,
    queryFn: ({ pageParam }) => getFeedPosts(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: status === "authenticated",
  });
}
