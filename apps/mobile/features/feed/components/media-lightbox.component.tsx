import { useCallback, useState } from "react";
import {
  Modal,
  Image as RNImage,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import { useThemeColors } from "@/shared/theme/use-theme-colors";
import type { FeedPost } from "../feed.types";

// ---------------------------------------------------------------------------
// Helpers (duplicated from feed-post for self-containment)
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
// Constants
// ---------------------------------------------------------------------------

const AVATAR_SIZE = 36;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MediaLightboxProps {
  visible: boolean;
  mediaUrl: string;
  post: FeedPost;
  onClose: () => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MediaLightbox({
  visible,
  mediaUrl,
  post,
  onClose,
  onLike,
  onComment,
  onShare,
}: MediaLightboxProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [footerVisible, setFooterVisible] = useState(true);

  const toggleFooter = useCallback(() => {
    setFooterVisible((prev) => !prev);
  }, []);

  const handleLike = useCallback(() => onLike?.(post.id), [onLike, post.id]);
  const handleComment = useCallback(
    () => onComment?.(post.id),
    [onComment, post.id],
  );
  const handleShare = useCallback(() => onShare?.(post.id), [onShare, post.id]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Box
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        {/* Close button */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: insets.top + 12,
            left: 16,
            zIndex: 20,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={22} color="white" />
        </Pressable>

        {/* Tappable image area */}
        <Pressable
          onPress={toggleFooter}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RNImage
            source={{ uri: mediaUrl }}
            resizeMode="contain"
            style={{
              width: screenWidth,
              height: screenHeight,
            }}
          />
        </Pressable>

        {/* Footer overlay */}
        {footerVisible && (
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom + 12,
              paddingTop: 14,
              paddingHorizontal: 16,
              backgroundColor: "rgba(0,0,0,0.65)",
            }}
          >
            {/* Author row */}
            <HStack style={{ alignItems: "center", gap: 10 }}>
              {post.author.avatarUrl ? (
                <Image
                  source={{ uri: post.author.avatarUrl }}
                  className="rounded-full"
                  alt="avatar"
                  style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                  size="none"
                />
              ) : (
                <Box
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person" size={18} color="white" />
                </Box>
              )}

              <VStack style={{ flex: 1 }}>
                <HStack style={{ alignItems: "center", gap: 6 }}>
                  <Text
                    bold
                    style={{ fontSize: 14, color: "white" }}
                    numberOfLines={1}
                  >
                    {post.author.displayName}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
                  >
                    {relativeTime(post.createdAt)}
                  </Text>
                </HStack>
                <Text
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                  numberOfLines={1}
                >
                  @{post.author.userName}
                </Text>
              </VStack>
            </HStack>

            {/* Description */}
            {post.text.length > 0 && (
              <Text
                style={{
                  fontSize: 13.5,
                  lineHeight: 19,
                  color: "rgba(255,255,255,0.9)",
                  marginTop: 10,
                }}
                numberOfLines={3}
              >
                {post.text}
              </Text>
            )}

            {/* Actions */}
            <HStack style={{ marginTop: 12, alignItems: "center" }}>
              <Pressable
                onPress={handleLike}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 4,
                  paddingRight: 18,
                  gap: 5,
                }}
              >
                <Ionicons
                  name={post.isLikedByMe ? "heart" : "heart-outline"}
                  size={20}
                  color={post.isLikedByMe ? colors.error[400] : "white"}
                />
                {post.likeCount > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: post.isLikedByMe
                        ? colors.error[400]
                        : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {formatCount(post.likeCount)}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleComment}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 4,
                  paddingRight: 18,
                  gap: 5,
                }}
              >
                <Ionicons name="chatbubble-outline" size={18} color="white" />
                {post.commentCount > 0 && (
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}
                  >
                    {formatCount(post.commentCount)}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleShare}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 4,
                  paddingRight: 18,
                  gap: 5,
                }}
              >
                <Ionicons name="share-outline" size={18} color="white" />
              </Pressable>
            </HStack>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
