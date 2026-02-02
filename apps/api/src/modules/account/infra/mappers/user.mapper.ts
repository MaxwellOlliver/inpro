import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { User as PrismaUser } from '@generated/prisma/client';
import { ID } from '@inpro/core';
import { Email } from '@modules/account/domain/value-objects/email.value-object';
import { Combine } from '@inpro/core';

type UserModel = PrismaUser & {
  password?: string;
};

export class UserMapper {
  static fromDomainToModel(item: User): UserModel {
    const { id, email, verified, createdAt, updatedAt, password } =
      item.toObject();

    return {
      id,
      email: email.value,
      password: password!,
      verified,
      createdAt,
      updatedAt,
    };
  }

  static fromModelToDomain(item: UserModel): User {
    const { id, email, verified, createdAt, updatedAt, password } = item;

    const [userId, userEmail] = Combine([
      ID.create(id),
      Email.create(email),
    ]).unwrap();

    return User.create({
      id: userId,
      email: userEmail,
      verified,
      createdAt,
      updatedAt,
      password,
    }).unwrap();
  }
}
