import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Combine, Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { SetProfileMediaCommand } from './set-profile-media.command';
import { UploadProfileMediaService } from '../../services/upload-profile-media.service';

@CommandHandler(SetProfileMediaCommand)
export class SetProfileMediaHandler
  implements ICommandHandler<SetProfileMediaCommand>
{
  constructor(
    private readonly uploadProfileMediaService: UploadProfileMediaService,
  ) {}

  async execute(command: SetProfileMediaCommand): Promise<Result<void>> {
    const { profileId, avatarFile, bannerFile } = command;

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
          'Error uploading profile media',
          'PROFILE_MEDIA_UPLOAD_ERROR',
          422,
        ),
      );
    }

    return Ok();
  }
}
