import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from '@inpro/core';
import { RegisterCommand } from './register.command';
import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository';
import { IRegistrationRepository } from '@modules/account/domain/interfaces/repositories/registration.repository';
import { HashGateway } from '@shared/application/gateways/hash.gateway';
import { Email } from '@modules/account/domain/value-objects/email.value-object';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';
import { BusinessException } from '@shared/exceptions/business.exception';

@Injectable()
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly registrationRepository: IRegistrationRepository,
    private readonly hashService: HashGateway,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<Result<{ user: User; profile: Profile }>> {
    const {
      email: emailInput,
      password,
      userName,
      name,
      bio,
      location,
    } = command.dto;

    const emailResult = Email.create(emailInput);

    if (emailResult.isErr()) {
      return Err(new BusinessException('Invalid email', 'INVALID_EMAIL', 400));
    }

    const email = emailResult.unwrap();
    const userExists = await this.userRepository.findByEmail(
      email.get('value'),
    );

    if (userExists.isOk()) {
      return Err(
        new BusinessException(
          'User already exists',
          'USER_ALREADY_EXISTS',
          400,
        ),
      );
    }

    const passwordHash = (
      await this.hashService.generateHash(password)
    ).unwrap();

    const userResult = User.create({
      email,
      password: passwordHash,
    });

    if (userResult.isErr()) {
      return Err(
        new BusinessException(
          'Error creating user',
          'USER_CREATION_ERROR',
          400,
        ),
      );
    }

    const user = userResult.unwrap();

    const profileResult = Profile.create({
      userId: user.id,
      userName,
      name,
      bio,
      location,
    });

    if (profileResult.isErr()) {
      return Err(
        new BusinessException(
          profileResult.unwrapErr().message,
          'PROFILE_CREATION_ERROR',
          400,
        ),
      );
    }

    const profile = profileResult.unwrap();

    const saveResult = await this.registrationRepository.save(user, profile);

    if (saveResult.isErr()) {
      return Err(
        new BusinessException(
          'Error saving registration',
          'REGISTRATION_SAVING_ERROR',
          422,
        ),
      );
    }

    user.commit();

    return Ok({ user, profile });
  }
}
