import { Query } from '@nestjs/cqrs';
import { Result } from '@inpro/core';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';

export class RetrieveProfileQuery extends Query<Result<Profile>> {
  constructor(public readonly userId: string) {
    super();
  }
}
