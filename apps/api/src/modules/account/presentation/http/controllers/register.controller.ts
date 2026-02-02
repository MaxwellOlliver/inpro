import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@shared/infra/security/jwt/decorators/public.decorator';
import { RegisterDTO } from '../dtos/register.dto';
import { RegisterCommand } from '@modules/account/application/commands/register/register.command';
import { UserPresenter } from '../presenters/user.presenter';
import { ProfilePresenter } from '../presenters/profile.presenter';

@ApiTags('Registration')
@Controller()
export class RegisterController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user with profile' })
  @ApiBody({ type: RegisterDTO })
  async register(@Body() dto: RegisterDTO) {
    const result = await this.commandBus.execute(new RegisterCommand(dto));

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const { user, profile } = result.unwrap();
    const userPresenter = new UserPresenter();
    const profilePresenter = new ProfilePresenter();

    return {
      user: userPresenter.presentUser(user),
      profile: profilePresenter.present(profile),
    };
  }
}
