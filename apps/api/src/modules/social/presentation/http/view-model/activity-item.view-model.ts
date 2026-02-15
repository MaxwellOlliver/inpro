import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';
import { MentionViewModel } from './comment.view-model';

export interface ActivityPostViewModel {
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

export interface ActivityCommentViewModel {
  id: string;
  profileId: string;
  postId: string;
  parentCommentId: string | null;
  text: string;
  mentions: MentionViewModel[];
  replyCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityItemViewModel =
  | {
      type: 'post';
      post: ActivityPostViewModel;
      activityAt: Date;
    }
  | {
      type: 'comment';
      post: ActivityPostViewModel;
      comment: ActivityCommentViewModel;
      activityAt: Date;
    }
  | {
      type: 'reply';
      post: ActivityPostViewModel;
      parentComment: ActivityCommentViewModel;
      comment: ActivityCommentViewModel;
      activityAt: Date;
    };
