export interface MentionViewModel {
  mentionedProfileId: string;
  startIndex: number;
  endIndex: number;
  surfaceText: string;
}

export interface CommentViewModel {
  id: string;
  profileId: string;
  postId: string;
  parentCommentId?: string | null;
  text: string;
  mentions: MentionViewModel[];
  createdAt: Date;
  updatedAt: Date;
}
