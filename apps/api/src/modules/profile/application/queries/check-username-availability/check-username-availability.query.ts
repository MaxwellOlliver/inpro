import { Result } from '@inpro/core';
import { Query } from '@nestjs/cqrs';

export class CheckUsernameAvailabilityQuery extends Query<Result<boolean>> {
  constructor(public readonly userName: string) {
    super();
  }
}
