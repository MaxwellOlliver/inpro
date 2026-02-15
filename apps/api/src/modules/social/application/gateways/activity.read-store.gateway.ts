import { Result } from '@inpro/core';
import { ActivityItemReadModel } from '../read-models/activity-item.read-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export interface ActivityCursorPagination {
  cursor?: string;
  take: number;
}

export abstract class ActivityReadStore {
  abstract findByProfileId(
    profileId: string,
    pagination: ActivityCursorPagination,
    requestorProfileId: string,
  ): Promise<Result<CursorPaginated<ActivityItemReadModel>>>;
}
