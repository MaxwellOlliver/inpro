import { CheckUsernameAvailabilityQuery } from '@modules/account/application/queries/check-username-availability/check-username-availability.query';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfilePresenter } from '../presenters/profile.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { Public } from '@shared/infra/security/jwt/decorators/public.decorator';
import { UpdateProfileDTO } from '../dtos/update-profile.dto';
import { UpdateProfileCommand } from '@modules/account/application/commands/update-profile/update-profile.command';
import { DeleteProfileCommand } from '@modules/account/application/commands/delete-profile/delete-profile.command';
import { SetProfileMediaCommand } from '@modules/account/application/commands/set-profile-media/set-profile-media.command';
import { RetrieveProfileQuery } from '@modules/account/application/queries/retrieve-profile/retrieve-profile.query';
import { BusinessException } from '@shared/exceptions/business.exception';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Get('check-username-availability')
  async checkUsernameAvailability(@Query('userName') userName?: string) {
    if (!userName) {
      throw new BusinessException(
        'Username is required',
        'PROFILE_USERNAME_REQUIRED',
        400,
      );
    }

    const availability = await this.queryBus.execute(
      new CheckUsernameAvailabilityQuery(userName),
    );

    if (availability.isErr()) {
      throw availability.unwrapErr();
    }

    return { available: availability.unwrap() };
  }

  @Get()
  async readProfile(@Principal() principal: IPrincipal) {
    const profile = await this.queryBus.execute(
      new RetrieveProfileQuery(principal.userId),
    );

    if (profile.isErr()) {
      throw profile.unwrapErr();
    }

    const presenter = new ProfilePresenter();

    return presenter.present(profile.unwrap());
  }

  @Patch()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDTO,
    @Principal() principal: IPrincipal,
  ) {
    const profile = await this.commandBus.execute(
      new UpdateProfileCommand(
        principal.userId,
        updateProfileDto.userName,
        updateProfileDto.name,
        updateProfileDto.location,
        updateProfileDto.bio,
      ),
    );

    if (profile.isErr()) {
      throw profile.unwrapErr();
    }

    const presenter = new ProfilePresenter();

    return presenter.present(profile.unwrap());
  }

  @Delete()
  async deleteProfile(@Principal() principal: IPrincipal) {
    const result = await this.commandBus.execute(
      new DeleteProfileCommand(principal.userId),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return { deleted: true };
  }

  @Post('media')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async setProfileMedia(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; banner?: Express.Multer.File[] },
    @Principal() principal: IPrincipal,
  ) {
    if (!files.avatar?.[0] || !files.banner?.[0]) {
      throw new BusinessException(
        'Avatar and banner files are required',
        'PROFILE_MEDIA_FILES_REQUIRED',
        400,
      );
    }

    const avatarFile = files.avatar[0];
    const bannerFile = files.banner[0];

    const result = await this.commandBus.execute(
      new SetProfileMediaCommand(
        principal.userId,
        {
          buffer: avatarFile.buffer,
          filename: avatarFile.originalname,
          mimetype: avatarFile.mimetype,
          size: avatarFile.size,
        },
        {
          buffer: bannerFile.buffer,
          filename: bannerFile.originalname,
          mimetype: bannerFile.mimetype,
          size: bannerFile.size,
        },
      ),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return { success: true };
  }
}
