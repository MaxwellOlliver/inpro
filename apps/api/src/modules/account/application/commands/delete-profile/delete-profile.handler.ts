import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProfileCommand } from './delete-profile.command';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: DeleteProfileCommand): Promise<Result<void>> {
    const profileResult = await this.profileRepository.findByUserId(
      command.userId,
    );

    if (profileResult.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    const deleteResult = await this.profileRepository.deleteByUserId(
      command.userId,
    );

    if (deleteResult.isErr()) {
      return Err(
        new BusinessException(
          'Error deleting profile',
          'PROFILE_DELETE_ERROR',
          422,
        ),
      );
    }

    return Ok();
  }
}
