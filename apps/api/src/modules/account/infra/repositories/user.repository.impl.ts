import { PrismaGateway } from '@shared/infra/db/prisma.gateway';
import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository.interface';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Err, Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaGateway) {}

  async save(user: User): Promise<Result<void>> {
    const userModel = UserMapper.fromDomainToModel(user);

    try {
      await this.prisma.client.user.upsert({
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
      const user = await this.prisma.client.user.findUnique({
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
      const user = await this.prisma.client.user.findUnique({
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
