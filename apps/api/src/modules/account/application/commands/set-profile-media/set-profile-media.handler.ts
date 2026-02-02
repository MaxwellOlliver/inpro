import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Combine, Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { SetProfileMediaCommand } from './set-profile-media.command';
import { UploadProfileMediaService } from '../../services/upload-profile-media.service';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';

@CommandHandler(SetProfileMediaCommand)
export class SetProfileMediaHandler
  implements ICommandHandler<SetProfileMediaCommand>
{
  constructor(
    private readonly uploadProfileMediaService: UploadProfileMediaService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: SetProfileMediaCommand): Promise<Result<void>> {
    const { userId, avatarFile, bannerFile } = command;

    const profileResult = await this.profileRepository.findByUserId(userId);

    if (profileResult.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    const profile = profileResult.unwrap();
    const profileId = profile.id.value();

    const avatarResult = await this.uploadProfileMediaService.handle(
      profileId,
      avatarFile,
      'avatar',
      600,
      600,
    );
    const bannerResult = await this.uploadProfileMediaService.handle(
      profileId,
      bannerFile,
      'banner',
      1500,
      500,
    );

    const mediaResults = Combine([avatarResult, bannerResult]);

    if (mediaResults.isErr()) {
      return Err(
        new BusinessException(
          mediaResults.unwrapErr().message,
          'PROFILE_MEDIA_UPLOAD_ERROR',
          422,
        ),
      );
    }

    const [avatar, banner] = mediaResults.unwrap();

    profile.setMedia(avatar.id, banner.id);

    await this.profileRepository.save(profile);

    return Ok();
  }
}
