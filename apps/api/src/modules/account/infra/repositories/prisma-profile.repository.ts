import { Err, Ok, Result } from '@inpro/core';
import { Profile } from '@modules/account/domain/aggregates/profile.aggregate';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { ProfileMapper } from '../mappers/profile.mapper';
import { PrismaClient } from '@generated/prisma/client';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(profile: Profile): Promise<Result<Profile>> {
    const profileModel = ProfileMapper.fromDomainToModel(profile);

    const result = await Result.fromPromise(
      this.prisma.profile.upsert({
        where: { id: profileModel.id },
        update: profileModel,
        create: profileModel,
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok(profile);
  }

  async findByUserId(userId: string): Promise<Result<Profile>> {
    const result = await Result.fromPromise(
      this.prisma.profile.findUnique({ where: { userId } }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const profile = result.unwrap();

    if (!profile) {
      return Err(new Error('Profile not found'));
    }

    return Ok(ProfileMapper.fromModelToDomain(profile));
  }

  async findById(id: string): Promise<Result<Profile>> {
    const result = await Result.fromPromise(
      this.prisma.profile.findUnique({ where: { id } }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const profile = result.unwrap();

    if (!profile) {
      return Err(new Error('Profile not found'));
    }

    return Ok(ProfileMapper.fromModelToDomain(profile));
  }

  async deleteByUserId(userId: string): Promise<Result<void>> {
    const result = await Result.fromPromise(
      this.prisma.profile.delete({ where: { userId } }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok();
  }
}
