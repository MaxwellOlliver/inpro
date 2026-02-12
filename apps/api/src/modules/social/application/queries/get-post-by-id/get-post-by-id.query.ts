import { Result } from '@inpro/core';
import { Query } from '@nestjs/cqrs';
import { PostDetailReadModel } from '../../read-models/post-detail.read-model';

export class GetPostByIdQuery extends Query<Result<PostDetailReadModel>> {
  constructor(
    public readonly postId: string,
    public readonly requestorProfileId: string,
  ) {
    super();
  }
}
