import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPostCommentsQuery } from './list-post-comments.query';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { CommentReadStore } from '../../gateways/comment.read-store.gateway';
import { CommentListItemReadModel } from '../../read-models/comment-list-item.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

@QueryHandler(ListPostCommentsQuery)
export class ListPostCommentsHandler
  implements IQueryHandler<ListPostCommentsQuery>
{
  constructor(private readonly commentReadStore: CommentReadStore) {}

  async execute(
    query: ListPostCommentsQuery,
  ): Promise<Result<CursorPaginated<CommentListItemReadModel>>> {
    const result = await this.commentReadStore.findByPostId(
      query.postId,
      { cursor: query.cursor, take: query.take },
      query.requestorProfileId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException(
          'Failed to fetch comments',
          'COMMENTS_FETCH_FAILED',
          500,
        ),
      );
    }

    return Ok(result.unwrap());
  }
}
