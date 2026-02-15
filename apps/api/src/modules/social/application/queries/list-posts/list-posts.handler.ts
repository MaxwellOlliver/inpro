import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPostsQuery } from './list-posts.query';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { PostReadStore } from '../../gateways/post.read-store.gateway';
import { PostDetailReadModel } from '../../read-models/post-detail.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

@QueryHandler(ListPostsQuery)
export class ListPostsHandler implements IQueryHandler<ListPostsQuery> {
  constructor(private readonly postReadStore: PostReadStore) {}

  async execute(
    query: ListPostsQuery,
  ): Promise<Result<CursorPaginated<PostDetailReadModel>>> {
    const result = await this.postReadStore.findAll(
      { cursor: query.cursor, take: query.take },
      query.requestorProfileId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException(
          'Failed to fetch posts',
          'POSTS_FETCH_FAILED',
          500,
        ),
      );
    }

    return Ok(result.unwrap());
  }
}
