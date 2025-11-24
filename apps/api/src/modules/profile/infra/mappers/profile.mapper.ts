import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { Profile as ProfileModel } from '@generated/prisma/client';
import { ProfileFactory } from '../factories/profile.factory';
import { ID } from '@inpro/core';

export class ProfileMapper {
  static fromModelToDomain(profile: ProfileModel): Profile {
    return ProfileFactory.make({
      id: ID.create(profile.id).unwrap(),
      userId: ID.create(profile.userId).unwrap(),
      name: profile.name,
      userName: profile.userName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl ?? null,
      bannerUrl: profile.bannerUrl ?? null,
      location: profile.location,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  static fromDomainToModel(item: Profile): ProfileModel {
    const {
      id,
      userName,
      bio,
      avatarUrl,
      bannerUrl,
      location,
      createdAt,
      updatedAt,
      userId,
      name,
    } = item.toObject();

    return {
      id,
      userId,
      userName,
      bio,
      avatarUrl: avatarUrl ?? null,
      bannerUrl: bannerUrl ?? null,
      location,
      createdAt,
      updatedAt,
      name,
    };
  }
}
