import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';

interface ProfileProps {
  id?: ID;
  userId: ID;
  name: string;
  userName: string;
  bio: string;
  avatarId?: ID | null;
  bannerId?: ID | null;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateProfileProps = Omit<
  ProfileProps,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Profile extends Aggregate<ProfileProps> {
  private constructor(props: ProfileProps) {
    super(props);
  }

  static create(raw: CreateProfileProps): Result<Profile> {
    const validateResult = Profile.validateProps(raw);

    if (validateResult.isErr()) {
      return Err(validateResult.unwrapErr());
    }

    const profile = new Profile({
      ...raw,
      avatarId: raw.avatarId ?? null,
      bannerId: raw.bannerId ?? null,
      createdAt: raw.createdAt ?? new Date(),
      updatedAt: raw.updatedAt ?? new Date(),
    });

    return Ok(profile);
  }

  static validateProps(props: CreateProfileProps): Result<void> {
    if (!props.userId) {
      return Err(new Error('User ID is required'));
    }

    if (!props.name) {
      return Err(new Error('Name is required'));
    }

    if (props.bio.length > 255) {
      return Err(new Error('Bio must be less than 255 characters'));
    }

    if (props.userName.length > 60) {
      return Err(new Error('UserName must be less than 255 characters'));
    }

    return Ok();
  }
}
