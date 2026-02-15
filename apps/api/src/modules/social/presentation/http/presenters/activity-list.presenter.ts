import {
  ActivityCommentSummary,
  ActivityItemReadModel,
  ActivityPostSummary,
} from '@modules/social/application/read-models/activity-item.read-model';
import {
  ActivityCommentViewModel,
  ActivityItemViewModel,
  ActivityPostViewModel,
} from '../view-model/activity-item.view-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class ActivityListPresenter {
  present(
    data: CursorPaginated<ActivityItemReadModel>,
  ): CursorPaginated<ActivityItemViewModel> {
    return {
      data: data.data.map((item) => this.mapItem(item)),
      nextCursor: data.nextCursor,
    };
  }

  private mapItem(item: ActivityItemReadModel): ActivityItemViewModel {
    switch (item.type) {
      case 'post':
        return {
          type: 'post',
          post: this.mapPost(item.post),
          activityAt: item.activityAt,
        };
      case 'comment':
        return {
          type: 'comment',
          post: this.mapPost(item.post),
          comment: this.mapComment(item.comment),
          activityAt: item.activityAt,
        };
      case 'reply':
        return {
          type: 'reply',
          post: this.mapPost(item.post),
          parentComment: this.mapComment(item.parentComment),
          comment: this.mapComment(item.comment),
          activityAt: item.activityAt,
        };
    }
  }

  private mapPost(post: ActivityPostSummary): ActivityPostViewModel {
    return {
      id: post.id,
      profileId: post.profileId,
      text: post.text,
      visibility: post.visibility,
      parentId: post.parentId,
      mediaIds: post.mediaIds,
      commentCount: post.commentCount,
      likeCount: post.likeCount,
      isLikedByMe: post.isLikedByMe,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private mapComment(
    comment: ActivityCommentSummary,
  ): ActivityCommentViewModel {
    return {
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
    };
  }
}
