import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { ProfileViewModel } from '../view-model/profile.view-model';

export class ProfilePresenter {
  present(profile: Profile): ProfileViewModel {
    const { id, userName, name, bio, location, avatarId, bannerId } =
      profile.toObject();

    return {
      id,
      userName,
      name,
      bio,
      location,
      avatarId,
      bannerId,
    };
  }
}
