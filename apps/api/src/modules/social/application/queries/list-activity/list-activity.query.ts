import { Result } from '@inpro/core';
import { Query } from '@nestjs/cqrs';
import { ActivityItemReadModel } from '../../read-models/activity-item.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class ListActivityQuery extends Query<
  Result<CursorPaginated<ActivityItemReadModel>>
> {
  constructor(
    public readonly profileId: string,
    public readonly cursor?: string,
    public readonly take: number = 10,
  ) {
    super();
  }
}
