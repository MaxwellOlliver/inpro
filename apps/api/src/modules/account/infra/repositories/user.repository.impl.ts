import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository.interface';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Err, Ok, Result } from '@inpro/core';
import { Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaClient } from '@generated/prisma/client';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<Result<void>> {
    const userModel = UserMapper.fromDomainToModel(user);

    try {
      await this.prisma.user.upsert({
        where: { id: userModel.id },
        update: userModel,
        create: userModel,
      });

      return Ok(undefined);
    } catch (error) {
      return Err(error);
    }
  }

  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return Err(new Error('User not found'));
      }

      const userDomain = UserMapper.fromModelToDomain(user);

      return Ok(userDomain);
    } catch (error) {
      return Err(error);
    }
  }

  async findById(id: string): Promise<Result<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return Err(new Error('User not found'));
      }

      const userDomain = UserMapper.fromModelToDomain(user);

      return Ok(userDomain);
    } catch (error) {
      return Err(error);
    }
  }
}
