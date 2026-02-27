import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toggleLikePost, type FeedPage } from "../api/feed.api";
import { feedQueryKey } from "../queries/use-feed.query";

type FeedCache = InfiniteData<FeedPage>;

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLikePost(postId),

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });

      const snapshot = queryClient.getQueryData<FeedCache>(feedQueryKey);

      queryClient.setQueryData<FeedCache>(feedQueryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id !== postId) return post;

              const liked = !post.isLikedByMe;
              return {
                ...post,
                isLikedByMe: liked,
                likeCount: post.likeCount + (liked ? 1 : -1),
              };
            }),
          })),
        };
      });

      return { snapshot };
    },

    onError: (_error, _postId, context) => {
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData<FeedCache>(feedQueryKey, context.snapshot);
      }
    },
  });
}
