import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export interface PostDetailReadModel {
  id: string;
  profileId: string;
  text: string;
  visibility: PostVisibility;
  parentId: string | null;
  mediaIds: string[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}
