import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import { CommentReadStore } from '@modules/social/application/gateways/comment.read-store.gateway';
import { CommentListItemReadModel } from '@modules/social/application/read-models/comment-list-item.read-model';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import {
  CursorPaginated,
  CursorPagination,
} from '@shared/utils/cursor-pagination';

export class PrismaCommentReadStore implements CommentReadStore {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async findByPostId(
    postId: string,
    pagination: CursorPagination,
  ): Promise<Result<CursorPaginated<CommentListItemReadModel>>> {
    const { cursor, take } = pagination;

    const result = await Result.fromPromise(
      this.prisma.comment.findMany({
        where: {
          postId,
          deletedAt: null,
          parentCommentId: null,
        },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        take,
        orderBy: { id: 'asc' },
        include: {
          mentions: {
            select: {
              mentionedProfileId: true,
              startIndex: true,
              endIndex: true,
              surfaceText: true,
            },
          },
          _count: { select: { replies: true } },
        },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const comments = result.unwrap();

    const data: CommentListItemReadModel[] = comments.map((comment) => ({
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
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    const nextCursor =
      comments.length === take ? comments[comments.length - 1].id : null;

    return Ok({ data, nextCursor });
  }
}
