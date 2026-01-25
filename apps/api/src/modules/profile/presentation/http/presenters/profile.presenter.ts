import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { ProfileViewModel } from '../view-model/profile.view-model';

export class ProfilePresenter {
  present(profile: Profile): ProfileViewModel {
    const { id, userName, name, bio, location, avatarId, bannerId } =
      profile.toObject();
    const avatarUrl = avatarId
      ? `${process.env.S3_ENDPOINT}/profile-media/profile/${id}/avatar/${avatarId}.webp`
      : null;
    const bannerUrl = bannerId
      ? `${process.env.S3_ENDPOINT}/profile-media/profile/${id}/banner/${bannerId}.webp`
      : null;

    return {
      id,
      userName,
      name,
      bio,
      location,
      avatarId,
      bannerId,
      avatarUrl,
      bannerUrl,
    };
  }
}
