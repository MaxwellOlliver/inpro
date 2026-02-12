import { CommentListItemReadModel } from '@modules/social/application/read-models/comment-list-item.read-model';
import { CommentListItemViewModel } from '../view-model/comment-list-item.view-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class CommentListPresenter {
  present(
    data: CursorPaginated<CommentListItemReadModel>,
  ): CursorPaginated<CommentListItemViewModel> {
    return {
      data: data.data.map((comment) => ({
        id: comment.id,
        profileId: comment.profileId,
        postId: comment.postId,
        parentCommentId: comment.parentCommentId,
        text: comment.text,
        mentions: comment.mentions.map((m) => ({
          mentionedProfileId: m.mentionedProfileId,
          startIndex: m.startIndex,
          endIndex: m.endIndex,
          surfaceText: m.surfaceText,
        })),
        replyCount: comment.replyCount,
        likeCount: comment.likeCount,
        isLikedByMe: comment.isLikedByMe,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
      nextCursor: data.nextCursor,
    };
  }
}
