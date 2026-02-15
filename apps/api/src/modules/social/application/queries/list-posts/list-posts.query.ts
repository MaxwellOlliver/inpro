import { Result } from '@inpro/core';
import { Query } from '@nestjs/cqrs';
import { PostDetailReadModel } from '../../read-models/post-detail.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class ListPostsQuery extends Query<
  Result<CursorPaginated<PostDetailReadModel>>
> {
  constructor(
    public readonly requestorProfileId: string,
    public readonly cursor?: string,
    public readonly take: number = 10,
  ) {
    super();
  }
}
