import { ID } from '@inpro/core';
import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

interface PostProps {
  id: ID;
  profileId: ID;
  text: string;
  visibility: PostVisibility;
  parentId: ID | null;
  mediaIds: ID[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PostFactory {
  static make(data: PostProps): Post {
    return Post.create({
      id: data.id,
      profileId: data.profileId,
      text: data.text,
      visibility: data.visibility,
      parentId: data.parentId,
      mediaIds: data.mediaIds,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }).unwrap();
  }
}
