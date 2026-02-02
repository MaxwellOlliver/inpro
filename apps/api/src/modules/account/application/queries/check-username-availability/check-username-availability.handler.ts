import { CheckUsernameAvailabilityQuery } from './check-username-availability.query';

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { ProfileReadStore } from '../../read-stores/profile.read-store';

@QueryHandler(CheckUsernameAvailabilityQuery)
export class CheckUsernameAvailabilityHandler
  implements IQueryHandler<CheckUsernameAvailabilityQuery>
{
  constructor(private readonly profileReadStore: ProfileReadStore) {}

  async execute(
    query: CheckUsernameAvailabilityQuery,
  ): Promise<Result<boolean>> {
    const { userName } = query;

    const profile =
      await this.profileReadStore.checkUsernameAvailability(userName);

    if (profile.isErr()) {
      return Err(
        new BusinessException(
          'Error while checking username availability',
          'PROFILE_CHECK_USERNAME_AVAILABILITY_ERROR',
          500,
        ),
      );
    }

    return Ok(profile.unwrap());
  }
}
