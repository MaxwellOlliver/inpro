import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListActivityQuery } from './list-activity.query';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { ActivityReadStore } from '../../gateways/activity.read-store.gateway';
import { ActivityItemReadModel } from '../../read-models/activity-item.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

@QueryHandler(ListActivityQuery)
export class ListActivityHandler implements IQueryHandler<ListActivityQuery> {
  constructor(private readonly activityReadStore: ActivityReadStore) {}

  async execute(
    query: ListActivityQuery,
  ): Promise<Result<CursorPaginated<ActivityItemReadModel>>> {
    const result = await this.activityReadStore.findByProfileId(
      query.profileId,
      { cursor: query.cursor, take: query.take },
      query.profileId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException(
          'Failed to fetch activity',
          'ACTIVITY_FETCH_FAILED',
          500,
        ),
      );
    }

    return Ok(result.unwrap());
  }
}
