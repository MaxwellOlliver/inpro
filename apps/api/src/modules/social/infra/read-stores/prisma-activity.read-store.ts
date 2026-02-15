import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import {
  ActivityCursorPagination,
  ActivityReadStore,
} from '@modules/social/application/gateways/activity.read-store.gateway';
import {
  ActivityCommentSummary,
  ActivityItemReadModel,
  ActivityPostSummary,
} from '@modules/social/application/read-models/activity-item.read-model';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class PrismaActivityReadStore implements ActivityReadStore {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient,
  ) {}

  async findByProfileId(
    profileId: string,
    pagination: ActivityCursorPagination,
    requestorProfileId: string,
  ): Promise<Result<CursorPaginated<ActivityItemReadModel>>> {
    const { cursor, take } = pagination;

    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    let cursorType: string | undefined;

    if (cursor) {
      const parsed = this.parseCursor(cursor);
      if (!parsed) {
        return Err(new Error('Invalid cursor format'));
      }
      cursorType = parsed.type;
      cursorId = parsed.id;
      cursorDate = parsed.createdAt;
    }

    const postWhereClause = this.buildWhereClause(
      profileId,
      cursorDate,
      cursorId,
      cursorType === 'post' ? cursorId : undefined,
    );

    const commentWhereClause = this.buildWhereClause(
      profileId,
      cursorDate,
      cursorId,
      undefined,
      cursorType === 'comment' || cursorType === 'reply'
        ? cursorId
        : undefined,
    );

    const [postsResult, commentsResult] = await Promise.all([
      Result.fromPromise(
        this.prisma.post.findMany({
          where: {
            profileId,
            deletedAt: null,
            ...postWhereClause,
          },
          take: take + 1,
          orderBy: { createdAt: 'desc' },
          include: {
            media: {
              select: { mediaId: true },
              orderBy: { order: 'asc' },
            },
            _count: { select: { comments: true, likes: true } },
            likes: {
              where: { profileId: requestorProfileId },
              select: { id: true },
              take: 1,
            },
          },
        }),
      ),
      Result.fromPromise(
        this.prisma.comment.findMany({
          where: {
            profileId,
            deletedAt: null,
            ...commentWhereClause,
          },
          take: take + 1,
          orderBy: { createdAt: 'desc' },
          include: {
            post: {
              include: {
                media: {
                  select: { mediaId: true },
                  orderBy: { order: 'asc' },
                },
                _count: { select: { comments: true, likes: true } },
                likes: {
                  where: { profileId: requestorProfileId },
                  select: { id: true },
                  take: 1,
                },
              },
            },
            parentComment: {
              include: {
                mentions: {
                  select: {
                    mentionedProfileId: true,
                    startIndex: true,
                    endIndex: true,
                    surfaceText: true,
                  },
                },
                _count: { select: { replies: true, likes: true } },
                likes: {
                  where: { profileId: requestorProfileId },
                  select: { id: true },
                  take: 1,
                },
              },
            },
            mentions: {
              select: {
                mentionedProfileId: true,
                startIndex: true,
                endIndex: true,
                surfaceText: true,
              },
            },
            _count: { select: { replies: true, likes: true } },
            likes: {
              where: { profileId: requestorProfileId },
              select: { id: true },
              take: 1,
            },
          },
        }),
      ),
    ]);

    if (postsResult.isErr()) {
      return Err(postsResult.getErr()!);
    }

    if (commentsResult.isErr()) {
      return Err(commentsResult.getErr()!);
    }

    const posts = postsResult.unwrap();
    const comments = commentsResult.unwrap();

    const postItems: ActivityItemReadModel[] = posts.map((post) => ({
      type: 'post' as const,
      post: this.mapPostSummary(post, requestorProfileId),
      activityAt: post.createdAt,
    }));

    const commentItems: ActivityItemReadModel[] = comments.map((comment) => {
      const postSummary = this.mapPostSummaryFromInclude(
        comment.post,
        requestorProfileId,
      );
      const commentSummary = this.mapCommentSummary(
        comment,
        requestorProfileId,
      );

      if (comment.parentComment) {
        return {
          type: 'reply' as const,
          post: postSummary,
          parentComment: this.mapParentCommentSummary(
            comment.parentComment,
            comment.postId,
            requestorProfileId,
          ),
          comment: commentSummary,
          activityAt: comment.createdAt,
        };
      }

      return {
        type: 'comment' as const,
        post: postSummary,
        comment: commentSummary,
        activityAt: comment.createdAt,
      };
    });

    const merged = [...postItems, ...commentItems].sort(
      (a, b) => b.activityAt.getTime() - a.activityAt.getTime(),
    );

    const data = merged.slice(0, take);
    const hasMore = merged.length > take;

    let nextCursor: string | null = null;
    if (hasMore && data.length > 0) {
      const lastItem = data[data.length - 1];
      nextCursor = this.encodeCursor(lastItem);
    }

    return Ok({ data, nextCursor });
  }

  private buildWhereClause(
    _profileId: string,
    cursorDate?: Date,
    cursorId?: string,
    postCursorId?: string,
    commentCursorId?: string,
  ): Record<string, unknown> {
    if (!cursorDate) return {};

    const conditions: Record<string, unknown>[] = [
      { createdAt: { lt: cursorDate } },
    ];

    if (postCursorId) {
      conditions.push({
        createdAt: cursorDate,
        id: { lt: postCursorId },
      });
    } else if (commentCursorId) {
      conditions.push({
        createdAt: cursorDate,
        id: { lt: commentCursorId },
      });
    }

    return { OR: conditions };
  }

  private parseCursor(
    cursor: string,
  ): { type: string; id: string; createdAt: Date } | null {
    const parts = cursor.split(':');
    if (parts.length !== 3) return null;

    const [type, id, timestampStr] = parts;
    if (!['post', 'comment', 'reply'].includes(type)) return null;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return null;

    return { type, id, createdAt: new Date(timestamp) };
  }

  private encodeCursor(item: ActivityItemReadModel): string {
    const type = item.type;
    let id: string;
    let createdAt: Date;

    switch (item.type) {
      case 'post':
        id = item.post.id;
        createdAt = item.post.createdAt;
        break;
      case 'comment':
        id = item.comment.id;
        createdAt = item.comment.createdAt;
        break;
      case 'reply':
        id = item.comment.id;
        createdAt = item.comment.createdAt;
        break;
    }

    return `${type}:${id}:${createdAt.getTime()}`;
  }

  private mapPostSummary(
    post: {
      id: string;
      profileId: string;
      text: string;
      visibility: string;
      parentId: string | null;
      media: { mediaId: string }[];
      _count: { comments: number; likes: number };
      likes: { id: string }[];
      createdAt: Date;
      updatedAt: Date;
    },
    _requestorProfileId: string,
  ): ActivityPostSummary {
    return {
      id: post.id,
      profileId: post.profileId,
      text: post.text,
      visibility: post.visibility as PostVisibility,
      parentId: post.parentId,
      mediaIds: post.media.map((m) => m.mediaId),
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      isLikedByMe: post.likes.length > 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private mapPostSummaryFromInclude(
    post: {
      id: string;
      profileId: string;
      text: string;
      visibility: string;
      parentId: string | null;
      media: { mediaId: string }[];
      _count: { comments: number; likes: number };
      likes: { id: string }[];
      createdAt: Date;
      updatedAt: Date;
    },
    requestorProfileId: string,
  ): ActivityPostSummary {
    return this.mapPostSummary(post, requestorProfileId);
  }

  private mapCommentSummary(
    comment: {
      id: string;
      profileId: string;
      postId: string;
      parentCommentId: string | null;
      text: string;
      mentions: {
        mentionedProfileId: string;
        startIndex: number;
        endIndex: number;
        surfaceText: string;
      }[];
      _count: { replies: number; likes: number };
      likes: { id: string }[];
      createdAt: Date;
      updatedAt: Date;
    },
    _requestorProfileId: string,
  ): ActivityCommentSummary {
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
      replyCount: comment._count.replies,
      likeCount: comment._count.likes,
      isLikedByMe: comment.likes.length > 0,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  private mapParentCommentSummary(
    comment: {
      id: string;
      profileId: string;
      postId: string;
      parentCommentId: string | null;
      text: string;
      mentions: {
        mentionedProfileId: string;
        startIndex: number;
        endIndex: number;
        surfaceText: string;
      }[];
      _count: { replies: number; likes: number };
      likes: { id: string }[];
      createdAt: Date;
      updatedAt: Date;
    },
    postId: string,
    _requestorProfileId: string,
  ): ActivityCommentSummary {
    return {
      id: comment.id,
      profileId: comment.profileId,
      postId,
      parentCommentId: comment.parentCommentId,
      text: comment.text,
      mentions: comment.mentions.map((m) => ({
        mentionedProfileId: m.mentionedProfileId,
        startIndex: m.startIndex,
        endIndex: m.endIndex,
        surfaceText: m.surfaceText,
      })),
      replyCount: comment._count.replies,
      likeCount: comment._count.likes,
      isLikedByMe: comment.likes.length > 0,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
