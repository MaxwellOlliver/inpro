import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import z from 'zod';

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

export class Profile extends Aggregate<ProfileProps> {
  static readonly schema = z.object({
    id: z.optional(z.custom<ID>((value) => value instanceof ID)),
    userId: z.custom<ID>((value) => value instanceof ID),
    name: z.string(),
    userName: z.string(),
    bio: z.string(),
    avatarId: z.optional(z.custom<ID>((value) => value instanceof ID)),
    bannerId: z.optional(z.custom<ID>((value) => value instanceof ID)),
    location: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  private constructor(props: ProfileProps) {
    super(props);
  }

  static create(props: ProfileProps): Result<Profile> {
    if (!Profile.isValidProps(props)) {
      return Err(new Error('Invalid profile props'));
    }

    const profile = new Profile({
      ...props,
      avatarId: props.avatarId ?? null,
      bannerId: props.bannerId ?? null,
    });

    return Ok(profile);
  }

  static isValidProps(props: ProfileProps) {
    return Profile.schema.safeParse(props).success;
  }
}
