export interface CommentListItemMention {
  mentionedProfileId: string;
  startIndex: number;
  endIndex: number;
  surfaceText: string;
}

export interface CommentListItemReadModel {
  id: string;
  profileId: string;
  postId: string;
  parentCommentId: string | null;
  text: string;
  mentions: CommentListItemMention[];
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}
