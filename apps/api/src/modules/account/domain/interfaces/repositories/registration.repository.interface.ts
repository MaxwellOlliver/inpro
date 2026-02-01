import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { Result } from '@inpro/core';

export abstract class IRegistrationRepository {
  abstract save(user: User, profile: Profile): Promise<Result<void>>;
}
