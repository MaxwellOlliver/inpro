import { api } from "../../../lib/api";
import type { FeedPost, MediaType } from "../feed.types";

interface PostMediaApiResponse {
  id: string;
  key: string;
  type: MediaType;
}

interface PostApiResponse {
  id: string;
  profileId: string;
  text: string;
  visibility: "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";
  parentId: string | null;
  media: PostMediaApiResponse[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  hasReplies: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    profileId: string;
    displayName: string;
    userName: string;
    bio: string;
    avatarUrl: string | null;
  };
}

interface FeedPageResponse {
  data: PostApiResponse[];
  nextCursor: string | null;
}

export interface FeedPage {
  data: FeedPost[];
  nextCursor: string | null;
}

function rewriteUrl(url: string): string {
  return url.replace("//localhost", "//10.0.2.2");
}

function mapPost(raw: PostApiResponse): FeedPost {
  return {
    ...raw,
    author: {
      ...raw.author,
      avatarUrl: raw.author.avatarUrl ? rewriteUrl(raw.author.avatarUrl) : null,
    },
    media: raw.media,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export async function getFeedPosts(
  cursor?: string,
  take = 15,
): Promise<FeedPage> {
  const params: Record<string, string> = { take: String(take) };

  if (cursor) params.cursor = cursor;

  const response = await api.get<FeedPageResponse>("/social/posts", { params });

  return {
    data: response.data.data.map(mapPost),
    nextCursor: response.data.nextCursor,
  };
}

export async function toggleLikePost(postId: string): Promise<void> {
  await api.post(`/social/posts/${postId}/like`);
}
