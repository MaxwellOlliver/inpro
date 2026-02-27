import { useCallback, useEffect, useState } from "react";
import {
  Image as RNImage,
  useWindowDimensions,
  type ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import {
  useThemeColors,
  type ThemeColors,
} from "@/shared/theme/use-theme-colors";
import { buildMediaUrl } from "@/lib/media";
import type { FeedPost, PostMedia } from "../feed.types";
import { MediaLightbox } from "./media-lightbox.component";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 52) return `${weeks}w`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatCount(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const AVATAR_SIZE = 40;
const THREAD_LINE_WIDTH = 2;

function Avatar({
  uri,
  fallbackColor,
  iconColor,
}: {
  uri: string | null;
  fallbackColor: string;
  iconColor: string;
}) {
  if (uri) {
    return (
      <Image source={{ uri }} className="rounded-full" size="xs" alt="avatar" />
    );
  }

  return (
    <Box
      className="bg-background-50"
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="person" size={20} color={iconColor} />
    </Box>
  );
}

function ThreadLineTop({ color }: { color: string }) {
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: AVATAR_SIZE / 2 - THREAD_LINE_WIDTH / 2,
        width: THREAD_LINE_WIDTH,
        height: 12,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  );
}

function ThreadLineBottom({ color }: { color: string }) {
  return (
    <Box
      style={{
        position: "absolute",
        top: AVATAR_SIZE + 4,
        bottom: 0,
        left: AVATAR_SIZE / 2 - THREAD_LINE_WIDTH / 2,
        width: THREAD_LINE_WIDTH,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Adaptive Image (resolves original dimensions at runtime)
// ---------------------------------------------------------------------------

const MAX_IMAGE_HEIGHT = 500;
const FALLBACK_ASPECT_RATIO = 4 / 3;

/**
 * Fetches the remote image dimensions and renders the image respecting its
 * original aspect ratio while capping the height at `MAX_IMAGE_HEIGHT`.
 */
function AdaptiveImage({
  uri,
  onPress,
}: {
  uri: string;
  onPress?: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState<number>(FALLBACK_ASPECT_RATIO);

  useEffect(() => {
    let cancelled = false;

    RNImage.getSize(
      uri,
      (w, h) => {
        if (!cancelled && w > 0 && h > 0) {
          setAspectRatio(w / h);
        }
      },
      () => {
        // On error, keep fallback ratio
      },
    );

    return () => {
      cancelled = true;
    };
  }, [uri]);

  // The image takes the full available width; compute the natural height,
  // then clamp it so tall portrait images don't dominate the feed.
  const naturalHeight = screenWidth / aspectRatio;
  const clampedHeight = Math.min(naturalHeight, MAX_IMAGE_HEIGHT);
  // If we clamped, the image is cropped vertically via `cover`.
  const isClamped = naturalHeight > MAX_IMAGE_HEIGHT;

  const imageStyle: ImageStyle = {
    width: "100%",
    height: clampedHeight,
  };

  return (
    <Pressable onPress={onPress}>
      <Box
        className="w-full"
        style={{
          marginTop: 10,
          overflow: "hidden",
        }}
      >
        <RNImage
          source={{ uri }}
          resizeMode={isClamped ? "cover" : "contain"}
          style={imageStyle}
        />
      </Box>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Media Grid
// ---------------------------------------------------------------------------

const MEDIA_GAP = 3;
const MEDIA_RADIUS = 0;

function MediaGrid({
  media,
  colors,
  onMediaPress,
}: {
  media: PostMedia[];
  colors: ThemeColors;
  onMediaPress?: (mediaUrl: string) => void;
}) {
  if (media.length === 0) return null;

  const urls = media.map((m) => buildMediaUrl(m.key));

  if (media.length === 1) {
    return (
      <AdaptiveImage uri={urls[0]} onPress={() => onMediaPress?.(urls[0])} />
    );
  }

  if (media.length === 2) {
    return (
      <HStack style={{ marginTop: 10, gap: MEDIA_GAP }}>
        {urls.map((url) => (
          <Pressable
            key={url}
            onPress={() => onMediaPress?.(url)}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: MEDIA_RADIUS,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: url }}
              alt="post media"
              size="none"
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </HStack>
    );
  }

  if (media.length === 3) {
    return (
      <HStack style={{ marginTop: 10, gap: MEDIA_GAP, height: 200 }}>
        <Pressable
          onPress={() => onMediaPress?.(urls[0])}
          style={{
            flex: 1,
            borderRadius: MEDIA_RADIUS,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: urls[0] }}
            alt="post media"
            size="none"
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </Pressable>
        <VStack style={{ flex: 1, gap: MEDIA_GAP }}>
          {urls.slice(1).map((url) => (
            <Pressable
              key={url}
              onPress={() => onMediaPress?.(url)}
              style={{
                flex: 1,
                borderRadius: MEDIA_RADIUS,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: url }}
                alt="post media"
                size="none"
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </VStack>
      </HStack>
    );
  }

  // 4 images - 2x2
  return (
    <VStack style={{ marginTop: 10, gap: MEDIA_GAP }}>
      {[0, 2].map((startIdx) => (
        <HStack key={startIdx} style={{ gap: MEDIA_GAP }}>
          {urls.slice(startIdx, startIdx + 2).map((url) => (
            <Pressable
              key={url}
              onPress={() => onMediaPress?.(url)}
              style={{
                flex: 1,
                aspectRatio: 16 / 9,
                borderRadius: MEDIA_RADIUS,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: url }}
                alt="post media"
                size="none"
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </HStack>
      ))}
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Action Button
// ---------------------------------------------------------------------------

function ActionButton({
  icon,
  activeIcon,
  count,
  active,
  activeColor,
  defaultColor,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  activeIcon?: React.ComponentProps<typeof Ionicons>["name"];
  count?: number;
  active?: boolean;
  activeColor: string;
  defaultColor: string;
  onPress?: () => void;
}) {
  const color = active ? activeColor : defaultColor;
  const resolvedIcon = active && activeIcon ? activeIcon : icon;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingRight: 16,
        gap: 5,
      }}
    >
      <Ionicons name={resolvedIcon} size={18} color={color} />
      {count !== undefined && count > 0 && (
        <Text style={{ fontSize: 12, color, letterSpacing: 0.2 }}>
          {formatCount(count)}
        </Text>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// FeedPost
// ---------------------------------------------------------------------------

export interface FeedPostProps {
  post: FeedPost;
  onPress?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onAuthorPress?: (profileId: string) => void;
  onMorePress?: (postId: string) => void;
}

export function FeedPostCard({
  post,
  onPress,
  onLike,
  onComment,
  onShare,
  onAuthorPress,
  onMorePress,
}: FeedPostProps) {
  const colors = useThemeColors();

  const isThreadReply = post.parentId !== null;
  const isThreadParent = post.hasReplies;
  const threadLineColor = colors.outline[300];

  // Lightbox state
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handlePress = useCallback(() => onPress?.(post.id), [onPress, post.id]);
  const handleLike = useCallback(() => onLike?.(post.id), [onLike, post.id]);
  const handleComment = useCallback(
    () => onComment?.(post.id),
    [onComment, post.id],
  );
  const handleShare = useCallback(() => onShare?.(post.id), [onShare, post.id]);
  const handleAuthorPress = useCallback(
    () => onAuthorPress?.(post.author.profileId),
    [onAuthorPress, post.author.profileId],
  );
  const handleMore = useCallback(
    () => onMorePress?.(post.id),
    [onMorePress, post.id],
  );

  const handleMediaPress = useCallback((mediaUrl: string) => {
    setLightboxUrl(mediaUrl);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxUrl(null);
  }, []);

  return (
    <>
      <Pressable onPress={handlePress} className="w-full">
        <HStack
          style={{
            paddingTop: isThreadReply ? 0 : 14,
            paddingBottom: 4,
          }}
        >
          {/* Content column */}
          <VStack style={{ flex: 1 }}>
            {/* Header row */}
            <HStack
              style={{ alignItems: "center", justifyContent: "space-between" }}
              className="px-6"
            >
              <VStack>
                <HStack style={{ flex: 1, alignItems: "center", gap: 6 }}>
                  <Pressable onPress={handleAuthorPress} style={{ zIndex: 1 }}>
                    <Avatar
                      uri={post.author.avatarUrl}
                      fallbackColor={colors.background[100]}
                      iconColor={colors.typography[400]}
                    />
                  </Pressable>
                  <VStack>
                    <HStack className="items-center gap-2">
                      <Pressable onPress={handleAuthorPress}>
                        <Text
                          bold
                          className="text-typography-900"
                          style={{ fontSize: 14 }}
                          numberOfLines={1}
                        >
                          {post.author.displayName}
                        </Text>
                      </Pressable>
                      <Text
                        className="text-typography-300"
                        style={{ fontSize: 12 }}
                      >
                        {relativeTime(post.createdAt)}
                      </Text>
                    </HStack>
                    <Text
                      className="text-typography-400"
                      style={{ fontSize: 13 }}
                      numberOfLines={1}
                    >
                      @{post.author.userName}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              <Pressable
                onPress={handleMore}
                style={{
                  padding: 4,
                  marginLeft: 4,
                  marginRight: -4,
                }}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={16}
                  color={colors.typography[400]}
                />
              </Pressable>
            </HStack>

            {/* Thread reply indicator */}
            {isThreadReply && (
              <HStack style={{ alignItems: "center", gap: 4, marginBottom: 2 }}>
                <Ionicons
                  name="return-down-forward-outline"
                  size={12}
                  color={colors.typography[300]}
                />
                <Text className="text-typography-300" style={{ fontSize: 11 }}>
                  reply in thread
                </Text>
              </HStack>
            )}

            {/* Post text */}
            <Text
              className="text-typography-800 px-6"
              style={{ fontSize: 14.5, lineHeight: 20, marginTop: 3 }}
            >
              {post.text}
            </Text>

            {/* Media */}
            <MediaGrid
              media={post.media}
              colors={colors}
              onMediaPress={handleMediaPress}
            />

            {/* Actions */}
            <HStack
              className="px-6"
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <ActionButton
                icon="heart-outline"
                activeIcon="heart"
                count={post.likeCount}
                active={post.isLikedByMe}
                activeColor={colors.error[400]}
                defaultColor={colors.typography[400]}
                onPress={handleLike}
              />
              <ActionButton
                icon="chatbubble-outline"
                count={post.commentCount}
                activeColor={colors.primary[400]}
                defaultColor={colors.typography[400]}
                onPress={handleComment}
              />
              <ActionButton
                icon="share-outline"
                activeColor={colors.primary[400]}
                defaultColor={colors.typography[400]}
                onPress={handleShare}
              />
            </HStack>
          </VStack>
        </HStack>
      </Pressable>

      {/* Media Lightbox */}
      {lightboxUrl !== null && (
        <MediaLightbox
          visible
          mediaUrl={lightboxUrl}
          post={post}
          onClose={handleLightboxClose}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      )}
    </>
  );
}
