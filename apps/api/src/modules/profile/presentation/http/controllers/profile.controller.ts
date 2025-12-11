import { CreateProfileCommand } from '@modules/profile/application/commands/create-profile/create-profile.command';
import { CheckUsernameAvailabilityQuery } from '@modules/profile/application/queries/check-username-availability/check-username-availability.query';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileDTO } from '../dtos/create-profile.dto';
import { ProfilePresenter } from '../presenters/profile.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { User } from '@modules/account/domain/aggregates/user.aggregate';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('check-username-availability')
  async checkUsernameAvailability(@Query('userName') userName: string) {
    return this.queryBus.execute(new CheckUsernameAvailabilityQuery(userName));
  }

  @Post()
  async createProfile(
    @Body() createProfileDto: CreateProfileDTO,
    @Principal() principal: User,
  ) {
    const profile = await this.commandBus.execute(
      new CreateProfileCommand(
        principal.id.value(),
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
}
