import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export interface ActivityPostSummary {
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

export interface ActivityCommentMention {
  mentionedProfileId: string;
  startIndex: number;
  endIndex: number;
  surfaceText: string;
}

export interface ActivityCommentSummary {
  id: string;
  profileId: string;
  postId: string;
  parentCommentId: string | null;
  text: string;
  mentions: ActivityCommentMention[];
  replyCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityItemReadModel =
  | {
      type: 'post';
      post: ActivityPostSummary;
      activityAt: Date;
    }
  | {
      type: 'comment';
      post: ActivityPostSummary;
      comment: ActivityCommentSummary;
      activityAt: Date;
    }
  | {
      type: 'reply';
      post: ActivityPostSummary;
      parentComment: ActivityCommentSummary;
      comment: ActivityCommentSummary;
      activityAt: Date;
    };
