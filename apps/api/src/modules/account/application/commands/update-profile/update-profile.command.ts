import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';

export class UpdateProfileCommand extends Command<Result<Profile>> {
  constructor(
    public readonly userId: string,
    public readonly userName?: string,
    public readonly name?: string,
    public readonly location?: string,
    public readonly bio?: string,
  ) {
    super();
  }
}
