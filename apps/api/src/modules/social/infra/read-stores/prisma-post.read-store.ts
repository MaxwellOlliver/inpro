import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import { PostReadStore } from '@modules/social/application/gateways/post.read-store.gateway';
import {
  PostDetailReadModel,
  PostMediaReadModel,
} from '@modules/social/application/read-models/post-detail.read-model';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import {
  CursorPaginated,
  CursorPagination,
} from '@shared/utils/cursor-pagination';

export class PrismaPostReadStore implements PostReadStore {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  private buildAvatarUrl(profileId: string, avatarId: string): string {
    return `${process.env.S3_ENDPOINT}/profile-media/profile/${profileId}/avatar/${avatarId}.webp`;
  }

  private async resolveMedia(
    mediaIds: string[],
  ): Promise<PostMediaReadModel[]> {
    if (mediaIds.length === 0) return [];

    const mediaRecords = await this.prisma.media.findMany({
      where: { id: { in: mediaIds } },
      select: { id: true, key: true, type: true },
    });

    const mediaMap = new Map<string, PostMediaReadModel>(
      mediaRecords.map((m) => [m.id, { id: m.id, key: m.key, type: m.type }]),
    );

    return mediaIds
      .map((id) => mediaMap.get(id))
      .filter((m): m is PostMediaReadModel => m !== undefined);
  }

  async findById(
    id: string,
    requestorProfileId: string,
  ): Promise<Result<PostDetailReadModel>> {
    const result = await Result.fromPromise(
      this.prisma.post.findUnique({
        where: { id, deletedAt: null },
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              userName: true,
              bio: true,
              avatarId: true,
            },
          },
          media: { select: { mediaId: true }, orderBy: { order: 'asc' } },
          _count: { select: { comments: true, likes: true, replies: true } },
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

    const avatarUrl = post.profile.avatarId
      ? this.buildAvatarUrl(post.profile.id, post.profile.avatarId)
      : null;

    const mediaIds = post.media.map((m) => m.mediaId);
    const media = await this.resolveMedia(mediaIds);

    return Ok({
      id: post.id,
      profileId: post.profileId,
      text: post.text,
      visibility: post.visibility as PostVisibility,
      parentId: post.parentId,
      media,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      isLikedByMe: post.likes.length > 0,
      hasReplies: post._count.replies > 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        profileId: post.profile.id,
        displayName: post.profile.name,
        userName: post.profile.userName,
        bio: post.profile.bio,
        avatarUrl,
      },
    });
  }

  async findAll(
    pagination: CursorPagination,
    requestorProfileId: string,
  ): Promise<Result<CursorPaginated<PostDetailReadModel>>> {
    const { cursor, take } = pagination;

    const result = await Result.fromPromise(
      this.prisma.post.findMany({
        where: { deletedAt: null },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        take,
        orderBy: { id: 'desc' },
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              userName: true,
              bio: true,
              avatarId: true,
            },
          },
          media: { select: { mediaId: true }, orderBy: { order: 'asc' } },
          _count: { select: { comments: true, likes: true, replies: true } },
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

    const posts = result.unwrap();

    // Batch-resolve all media info in one query
    const allMediaIds = posts.flatMap((p) => p.media.map((m) => m.mediaId));
    const uniqueMediaIds = [...new Set(allMediaIds)];
    const mediaRecords =
      uniqueMediaIds.length > 0
        ? await this.prisma.media.findMany({
            where: { id: { in: uniqueMediaIds } },
            select: { id: true, key: true, type: true },
          })
        : [];
    const mediaMap = new Map<string, PostMediaReadModel>(
      mediaRecords.map((m) => [m.id, { id: m.id, key: m.key, type: m.type }]),
    );

    const data: PostDetailReadModel[] = posts.map((post) => {
      const avatarUrl = post.profile.avatarId
        ? this.buildAvatarUrl(post.profile.id, post.profile.avatarId)
        : null;

      const postMediaIds = post.media.map((m) => m.mediaId);
      const media = postMediaIds
        .map((id) => mediaMap.get(id))
        .filter((m): m is PostMediaReadModel => m !== undefined);

      return {
        id: post.id,
        profileId: post.profileId,
        text: post.text,
        visibility: post.visibility as PostVisibility,
        parentId: post.parentId,
        media,
        commentCount: post._count.comments,
        likeCount: post._count.likes,
        isLikedByMe: post.likes.length > 0,
        hasReplies: post._count.replies > 0,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          profileId: post.profile.id,
          displayName: post.profile.name,
          userName: post.profile.userName,
          bio: post.profile.bio,
          avatarUrl,
        },
      };
    });

    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    return Ok({ data, nextCursor });
  }
}
