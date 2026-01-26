import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import {
  Post as PostModel,
  PostMedia as PostMediaModel,
  PostVisibility as PrismaPostVisibility,
} from '@generated/prisma/client';
import { PostFactory } from '../factories/post.factory';
import { ID } from '@inpro/core';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

type PostModelWithMedia = PostModel & {
  media?: PostMediaModel[];
};

export class PostMapper {
  static fromModelToDomain(post: PostModelWithMedia): Post {
    return PostFactory.make({
      id: ID.create(post.id).unwrap(),
      profileId: ID.create(post.profileId).unwrap(),
      text: post.text,
      visibility: PostMapper.mapPrismaVisibilityToDomain(post.visibility),
      parentId: post.parentId ? ID.create(post.parentId).unwrap() : null,
      mediaIds: post.media
        ? post.media
            .sort((a, b) => a.order - b.order)
            .map((m) => ID.create(m.mediaId).unwrap())
        : [],
      deletedAt: post.deletedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  }

  static fromDomainToModel(
    item: Post,
  ): PostModel & { mediaIds: { mediaId: string; order: number }[] } {
    const {
      id,
      profileId,
      text,
      visibility,
      parentId,
      mediaIds,
      deletedAt,
      createdAt,
      updatedAt,
    } = item.toObject();

    return {
      id,
      profileId,
      text,
      visibility: PostMapper.mapDomainVisibilityToPrisma(visibility),
      parentId: parentId ?? null,
      deletedAt: deletedAt ?? null,
      createdAt,
      updatedAt,
      mediaIds: mediaIds.map((mediaId, index) => ({
        mediaId,
        order: index,
      })),
    };
  }

  private static mapPrismaVisibilityToDomain(
    visibility: PrismaPostVisibility,
  ): PostVisibility {
    const map: Record<PrismaPostVisibility, PostVisibility> = {
      PUBLIC: PostVisibility.PUBLIC,
      FOLLOWERS_ONLY: PostVisibility.FOLLOWERS_ONLY,
      PRIVATE: PostVisibility.PRIVATE,
    };
    return map[visibility];
  }

  private static mapDomainVisibilityToPrisma(
    visibility: PostVisibility,
  ): PrismaPostVisibility {
    const map: Record<PostVisibility, PrismaPostVisibility> = {
      [PostVisibility.PUBLIC]: 'PUBLIC',
      [PostVisibility.FOLLOWERS_ONLY]: 'FOLLOWERS_ONLY',
      [PostVisibility.PRIVATE]: 'PRIVATE',
    };
    return map[visibility];
  }
}
