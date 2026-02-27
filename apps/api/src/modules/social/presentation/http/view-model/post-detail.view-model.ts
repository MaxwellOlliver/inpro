import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export interface PostAuthorViewModel {
  profileId: string;
  displayName: string;
  userName: string;
  bio: string;
  avatarUrl: string | null;
}

export interface PostMediaViewModel {
  id: string;
  key: string;
  type: string;
}

export interface PostDetailViewModel {
  id: string;
  profileId: string;
  text: string;
  visibility: PostVisibility;
  parentId: string | null;
  media: PostMediaViewModel[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  hasReplies: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthorViewModel;
}
