import { Err, Ok, Result } from '@inpro/core';
import { Profile } from '@modules/profile/domain/aggregates/profile.aggregate';
import { IProfileRepository } from '@modules/profile/domain/interfaces/repositories/profile.repository';
import { Injectable } from '@nestjs/common';
import { PrismaGateway } from '@shared/gateways/db/prisma.gateway';
import { ProfileMapper } from '../mappers/profile.mapper';

@Injectable()
export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private readonly prisma: PrismaGateway) {}

  async save(profile: Profile): Promise<Result<Profile>> {
    const profileModel = ProfileMapper.fromDomainToModel(profile);

    const result = await Result.fromPromise(
      this.prisma.client.profile.upsert({
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
      this.prisma.client.profile.findUnique({ where: { userId } }),
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
      this.prisma.client.profile.findUnique({ where: { id } }),
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
}
