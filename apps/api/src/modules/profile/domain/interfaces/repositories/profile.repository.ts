import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { Result } from '@inpro/core';

export abstract class ProfileRepository {
  abstract save(profile: Profile): Promise<Result<Profile>>;
  abstract findByUserId(userId: string): Promise<Result<Profile>>;
  abstract findById(id: string): Promise<Result<Profile>>;
  abstract deleteByUserId(userId: string): Promise<Result<void>>;
}
