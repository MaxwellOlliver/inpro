import { CreateProfileCommand } from '@modules/profile/application/commands/create-profile/create-profile.command';
import { CheckUsernameAvailabilityQuery } from '@modules/profile/application/queries/check-username-availability/check-username-availability.query';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileDTO } from '../dtos/create-profile.dto';
import { ProfilePresenter } from '../presenters/profile.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { Public } from '@shared/infra/security/jwt/decorators/public.decorator';
import { UpdateProfileDTO } from '../dtos/update-profile.dto';
import { UpdateProfileCommand } from '@modules/profile/application/commands/update-profile/update-profile.command';
import { DeleteProfileCommand } from '@modules/profile/application/commands/delete-profile/delete-profile.command';
import { RetrieveProfileQuery } from '@modules/profile/application/queries/retrieve-profile/retrieve-profile.query';
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

  @Post()
  async createProfile(
    @Body() createProfileDto: CreateProfileDTO,
    @Principal() principal: IPrincipal,
  ) {
    const profile = await this.commandBus.execute(
      new CreateProfileCommand(
        principal.userId,
        createProfileDto.userName,
        createProfileDto.name,
        createProfileDto.location,
        createProfileDto.bio,
      ),
    );

    if (profile.isErr()) {
      throw profile.unwrapErr();
    }

    const presenter = new ProfilePresenter();

    const profileViewModel = presenter.present(profile.unwrap());

    return profileViewModel;
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
}
