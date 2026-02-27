import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export interface PostAuthorReadModel {
  profileId: string;
  displayName: string;
  userName: string;
  bio: string;
  avatarUrl: string | null;
}

export interface PostMediaReadModel {
  id: string;
  key: string;
  type: string;
}

export interface PostDetailReadModel {
  id: string;
  profileId: string;
  text: string;
  visibility: PostVisibility;
  parentId: string | null;
  media: PostMediaReadModel[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  hasReplies: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthorReadModel;
}
