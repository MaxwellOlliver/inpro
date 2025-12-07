import { ID } from '@inpro/core';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';

interface ProfileProps {
  id: ID;
  userId: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userName: string;
  bio: string;
  avatarId: ID | null;
  bannerId: ID | null;
  location: string;
}

export class ProfileFactory {
  static make(data: ProfileProps): Profile {
    return Profile.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      userName: data.userName,
      bio: data.bio,
      avatarId: data.avatarId,
      bannerId: data.bannerId,
      location: data.location,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }).unwrap();
  }
}
