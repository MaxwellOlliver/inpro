import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import z from 'zod';

interface ProfileProps {
  id?: ID;
  userId: ID;
  name: string;
  userName: string;
  bio: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
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
    avatarUrl: z.string().nullable(),
    bannerUrl: z.string().nullable(),
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
      avatarUrl: props.avatarUrl ?? null,
      bannerUrl: props.bannerUrl ?? null,
    });

    return Ok(profile);
  }

  static isValidProps(props: ProfileProps) {
    return Profile.schema.safeParse(props).success;
  }
}
