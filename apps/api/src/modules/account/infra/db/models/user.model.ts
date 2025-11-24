import { User } from '@generated/prisma/client';

export type UserModel = User & {
  password?: string;
};
