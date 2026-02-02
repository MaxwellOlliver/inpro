import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';

export interface RegisterInput {
  email: string;
  password: string;
  userName: string;
  name: string;
  bio: string;
  location: string;
}

export class RegisterCommand extends Command<
  Result<{ user: User; profile: Profile }>
> {
  constructor(public readonly dto: RegisterInput) {
    super();
  }
}
