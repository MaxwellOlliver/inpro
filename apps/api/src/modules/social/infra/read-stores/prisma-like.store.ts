import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import {
  LikeStore,
  LikeToggleResult,
} from '@modules/social/application/gateways/like.store.gateway';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';

export class PrismaLikeStore implements LikeStore {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async togglePostLike(
    profileId: string,
    postId: string,
  ): Promise<Result<LikeToggleResult>> {
    const result = await Result.fromPromise(
      this.prisma.$transaction(async (tx) => {
        const existing = await tx.postLike.findUnique({
          where: { profileId_postId: { profileId, postId } },
        });

        if (existing) {
          await tx.postLike.delete({ where: { id: existing.id } });
        } else {
          await tx.postLike.create({ data: { profileId, postId } });
        }

        const likeCount = await tx.postLike.count({ where: { postId } });

        return { liked: !existing, likeCount };
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok(result.unwrap());
  }

  async toggleCommentLike(
    profileId: string,
    commentId: string,
  ): Promise<Result<LikeToggleResult>> {
    const result = await Result.fromPromise(
      this.prisma.$transaction(async (tx) => {
        const existing = await tx.commentLike.findUnique({
          where: { profileId_commentId: { profileId, commentId } },
        });

        if (existing) {
          await tx.commentLike.delete({ where: { id: existing.id } });
        } else {
          await tx.commentLike.create({ data: { profileId, commentId } });
        }

        const likeCount = await tx.commentLike.count({
          where: { commentId },
        });

        return { liked: !existing, likeCount };
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok(result.unwrap());
  }
}
