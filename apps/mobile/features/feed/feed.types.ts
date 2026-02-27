export type PostVisibility = "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";

export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";

export interface PostMedia {
  id: string;
  key: string;
  type: MediaType;
}

export interface PostAuthor {
  profileId: string;
  displayName: string;
  userName: string;
  bio: string;
  avatarUrl: string | null;
}

export interface FeedPost {
  id: string;
  profileId: string;
  text: string;
  visibility: PostVisibility;
  parentId: string | null;
  media: PostMedia[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  hasReplies: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
}
