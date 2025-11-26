import { Result } from '@inpro/core';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';

export type CreateProfileInputDTO = {
  profileId: string;
  avatar: Express.Multer.File;
};

export type CreateProfileOutputDTO = Result<{
  profile: Profile;
}>;
