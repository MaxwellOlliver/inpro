import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import { PostReadStore } from '@modules/social/application/gateways/post.read-store.gateway';
import { PostDetailReadModel } from '@modules/social/application/read-models/post-detail.read-model';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';

export class PrismaPostReadStore implements PostReadStore {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async findById(
    id: string,
    requestorProfileId: string,
  ): Promise<Result<PostDetailReadModel>> {
    const result = await Result.fromPromise(
      this.prisma.post.findUnique({
        where: { id, deletedAt: null },
        include: {
          media: { select: { mediaId: true }, orderBy: { order: 'asc' } },
          _count: { select: { comments: true, likes: true } },
          likes: {
            where: { profileId: requestorProfileId },
            select: { id: true },
            take: 1,
          },
        },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const post = result.unwrap();

    if (!post) {
      return Err(new Error('Post not found'));
    }

    return Ok({
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
    });
  }
}
