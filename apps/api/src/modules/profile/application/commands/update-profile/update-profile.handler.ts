import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update-profile.command';
import { ProfileRepository } from '@modules/profile/domain/interfaces/repositories/profile.repository';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { ProfileReadStore } from '../../read-stores/profile.read-store';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileReadStore: ProfileReadStore,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Result<Profile>> {
    const { userId, userName, name, bio, location } = command;

    const profileResult = await this.profileRepository.findByUserId(userId);

    if (profileResult.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    const profile = profileResult.unwrap();
    const currentUserName = profile.get('userName');

    if (userName && userName !== currentUserName) {
      const availability =
        await this.profileReadStore.checkUsernameAvailability(userName);

      if (availability.isErr()) {
        return Err(
          new BusinessException(
            'Error while checking username availability',
            'PROFILE_CHECK_USERNAME_AVAILABILITY_ERROR',
            500,
          ),
        );
      }

      if (!availability.unwrap()) {
        return Err(
          new BusinessException(
            'Username already taken',
            'PROFILE_USERNAME_TAKEN',
            409,
          ),
        );
      }
    }

    const updateResult = profile.update({
      userName,
      name,
      bio,
      location,
    });

    if (updateResult.isErr()) {
      return Err(
        new BusinessException(
          updateResult.unwrapErr().message,
          'PROFILE_UPDATE_ERROR',
          400,
        ),
      );
    }

    const profileSaved = await this.profileRepository.save(profile);

    if (profileSaved.isErr()) {
      return Err(
        new BusinessException(
          'Error saving profile',
          'PROFILE_SAVING_ERROR',
          422,
        ),
      );
    }

    return Ok(profile);
  }
}
