import { Result } from '@inpro/core';
import { Query } from '@nestjs/cqrs';
import { CommentListItemReadModel } from '../../read-models/comment-list-item.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class ListPostCommentsQuery extends Query<
  Result<CursorPaginated<CommentListItemReadModel>>
> {
  constructor(
    public readonly postId: string,
    public readonly cursor?: string,
    public readonly take: number = 10,
  ) {
    super();
  }
}
