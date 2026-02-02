import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';
import { Profile as ProfileModel } from '@generated/prisma/client';
import { ID } from '@inpro/core';

export class ProfileMapper {
  static fromModelToDomain(profile: ProfileModel): Profile {
    return Profile.create({
      id: ID.create(profile.id).unwrap(),
      userId: ID.create(profile.userId).unwrap(),
      name: profile.name,
      userName: profile.userName,
      bio: profile.bio,
      avatarId: profile.avatarId ? ID.create(profile.avatarId).unwrap() : null,
      bannerId: profile.bannerId ? ID.create(profile.bannerId).unwrap() : null,
      location: profile.location,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }).unwrap();
  }

  static fromDomainToModel(item: Profile): ProfileModel {
    const {
      id,
      userName,
      bio,
      avatarId,
      bannerId,
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
      avatarId: avatarId ?? null,
      bannerId: bannerId ?? null,
      location,
      createdAt,
      updatedAt,
      name,
    };
  }
}
