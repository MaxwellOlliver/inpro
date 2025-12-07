import { PrismaClient } from '@generated/prisma/client';
import { Ok, Err, Result, ID } from '@inpro/core';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { MediaMapper } from '../mappers/media.mapper';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';

@Injectable()
export class PrismaMediaRepository implements MediaRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(media: Media): Promise<Result<void>> {
    const mediaModel = MediaMapper.fromDomainToModel(media);

    const result = await Result.fromPromise(
      this.prisma.media.upsert({
        where: { id: mediaModel.id },
        update: mediaModel,
        create: mediaModel,
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok();
  }

  async findById(id: ID): Promise<Result<Media>> {
    const result = await Result.fromPromise(
      this.prisma.media.findUnique({
        where: { id: id.value() },
      }),
    );

    if (result.isErr() || !result.unwrap()) {
      return Err(new Error('Media not found'));
    }

    return Ok(MediaMapper.fromModelToDomain(result.unwrap()!));
  }

  async findByKey(key: string): Promise<Result<Media>> {
    const result = await Result.fromPromise(
      this.prisma.media.findUnique({
        where: { key },
      }),
    );

    if (result.isErr() || !result.unwrap()) {
      return Err(new Error('Media not found'));
    }

    return Ok(MediaMapper.fromModelToDomain(result.unwrap()!));
  }

  async delete(id: ID): Promise<Result<void>> {
    const result = await Result.fromPromise(
      this.prisma.media.delete({
        where: { id: id.value() },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok();
  }
}
