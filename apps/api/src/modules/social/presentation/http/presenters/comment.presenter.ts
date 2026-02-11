import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import { CommentViewModel } from '../view-model/comment.view-model';

export class CommentPresenter {
  present(comment: Comment): CommentViewModel {
    const {
      id,
      profileId,
      postId,
      parentCommentId,
      text,
      mentions,
      createdAt,
      updatedAt,
    } = comment.toObject();

    return {
      id,
      profileId,
      postId,
      parentCommentId,
      text,
      mentions: mentions.map((m) => ({
        mentionedProfileId: m.mentionedProfileId,
        startIndex: m.startIndex,
        endIndex: m.endIndex,
        surfaceText: m.surfaceText,
      })),
      createdAt,
      updatedAt,
    };
  }
}
