import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma/client';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { IRegistrationRepository } from '@modules/account/domain/interfaces/repositories/registration.repository';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';
import { UserMapper } from '../mappers/user.mapper';
import { ProfileMapper } from '../mappers/profile.mapper';
import { Result } from '@inpro/core';

@Injectable()
export class PrismaRegistrationRepository implements IRegistrationRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(user: User, profile: Profile): Promise<Result<void>> {
    const userModel = UserMapper.fromDomainToModel(user);
    const profileModel = ProfileMapper.fromDomainToModel(profile);

    return await Result.fromPromise(
      this.prisma.$transaction([
        this.prisma.user.create({ data: userModel }),
        this.prisma.profile.create({ data: profileModel }),
      ]),
    );
  }
}
