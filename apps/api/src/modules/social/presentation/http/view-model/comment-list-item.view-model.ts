import { MentionViewModel } from './comment.view-model';

export interface CommentListItemViewModel {
  id: string;
  profileId: string;
  postId: string;
  parentCommentId: string | null;
  text: string;
  mentions: MentionViewModel[];
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}
