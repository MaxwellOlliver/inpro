import { useCallback, useMemo } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useFeedQuery } from "../queries/use-feed.query";
import { useLikePost } from "../mutations/use-like-post.mutation";
import { FeedPostCard } from "../components/feed-post.component";
import { useThemeColors } from "@/shared/theme/use-theme-colors";
import type { FeedPost } from "../feed.types";

export function FeedScreen() {
  const colors = useThemeColors();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useFeedQuery();

  const { mutate: likePost } = useLikePost();

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLike = useCallback(
    (postId: string) => likePost(postId),
    [likePost],
  );

  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => (
      <FeedPostCard post={item} onLike={handleLike} />
    ),
    [handleLike],
  );

  const keyExtractor = useCallback((item: FeedPost) => item.id, []);

  if (isLoading) {
    return (
      <Box
        style={{
          flex: 1,
          backgroundColor: colors.background[0],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary[400]} />
      </Box>
    );
  }

  return (
    <Box style={{ flex: 1, backgroundColor: colors.background[0] }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary[400]}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator color={colors.primary[400]} />
            </Box>
          ) : null
        }
        ListEmptyComponent={
          <Box
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <Text style={{ color: colors.typography[300], fontSize: 15 }}>
              No posts yet
            </Text>
          </Box>
        }
      />
    </Box>
  );
}
