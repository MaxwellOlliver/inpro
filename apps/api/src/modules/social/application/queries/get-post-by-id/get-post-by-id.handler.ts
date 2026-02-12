import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostByIdQuery } from './get-post-by-id.query';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { PostReadStore } from '../../gateways/post.read-store.gateway';
import { PostDetailReadModel } from '../../read-models/post-detail.read-model';

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postReadStore: PostReadStore) {}

  async execute(query: GetPostByIdQuery): Promise<Result<PostDetailReadModel>> {
    const result = await this.postReadStore.findById(
      query.postId,
      query.requestorProfileId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException('Post not found', 'POST_NOT_FOUND', 404),
      );
    }

    return Ok(result.unwrap());
  }
}
