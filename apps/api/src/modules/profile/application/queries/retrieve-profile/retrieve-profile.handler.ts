import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveProfileQuery } from './retrieve-profile.query';
import { ProfileRepository } from '@modules/profile/domain/interfaces/repositories/profile.repository';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';

@QueryHandler(RetrieveProfileQuery)
export class RetrieveProfileHandler
  implements IQueryHandler<RetrieveProfileQuery>
{
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: RetrieveProfileQuery): Promise<Result<Profile>> {
    const profileResult = await this.profileRepository.findByUserId(
      query.userId,
    );

    if (profileResult.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    return Ok(profileResult.unwrap());
  }
}
