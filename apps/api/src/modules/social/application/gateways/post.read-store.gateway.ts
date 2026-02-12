import { Result } from '@inpro/core';
import { PostDetailReadModel } from '../read-models/post-detail.read-model';

export abstract class PostReadStore {
  abstract findById(
    id: string,
    requestorProfileId: string,
  ): Promise<Result<PostDetailReadModel>>;
}
