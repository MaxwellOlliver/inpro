import { Err, Ok, Result } from '@inpro/core';
import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { PostRepository } from '@modules/social/domain/interfaces/repositories/post.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { PostMapper } from '../mappers/post.mapper';
import { PrismaClient } from '@generated/prisma/client';

@Injectable()
export class PrismaPostRepository implements PostRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(post: Post): Promise<Result<Post>> {
    const postModel = PostMapper.fromDomainToModel(post);
    const { mediaIds, ...postData } = postModel;

    const result = await Result.fromPromise(
      this.prisma.$transaction(async (tx) => {
        const savedPost = await tx.post.upsert({
          where: { id: postData.id },
          update: postData,
          create: postData,
        });

        await tx.postMedia.deleteMany({
          where: { postId: savedPost.id },
        });

        if (mediaIds.length > 0) {
          await tx.postMedia.createMany({
            data: mediaIds.map((media) => ({
              postId: savedPost.id,
              mediaId: media.mediaId,
              order: media.order,
            })),
          });
        }

        return tx.post.findUnique({
          where: { id: savedPost.id },
          include: { media: true },
        });
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const savedPost = result.unwrap();
    if (!savedPost) {
      return Err(new Error('Failed to save post'));
    }

    return Ok(PostMapper.fromModelToDomain(savedPost));
  }

  async findById(id: string): Promise<Result<Post>> {
    const result = await Result.fromPromise(
      this.prisma.post.findUnique({
        where: { id },
        include: { media: true },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const post = result.unwrap();

    if (!post) {
      return Err(new Error('Post not found'));
    }

    return Ok(PostMapper.fromModelToDomain(post));
  }

  async findByProfileId(profileId: string): Promise<Result<Post[]>> {
    const result = await Result.fromPromise(
      this.prisma.post.findMany({
        where: { profileId, deletedAt: null },
        include: { media: true },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const posts = result.unwrap();

    return Ok(posts.map((post) => PostMapper.fromModelToDomain(post)));
  }
}
