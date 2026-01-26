import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { Result } from '@inpro/core';

export abstract class PostRepository {
  abstract save(post: Post): Promise<Result<Post>>;
  abstract findById(id: string): Promise<Result<Post>>;
  abstract findByProfileId(profileId: string): Promise<Result<Post[]>>;
}
