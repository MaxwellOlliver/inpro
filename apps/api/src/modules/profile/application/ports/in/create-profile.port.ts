import { Result } from '@inpro/core';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';

export type CreateProfileInputDTO = {
  userId: string;
  userName: string;
  name: string;
  bio: string;
  avatarId?: string;
  bannerId?: string;
  location: string;
};

export type CreateProfileOutputDTO = Result<{
  profile: Profile;
}>;
