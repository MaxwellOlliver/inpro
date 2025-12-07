import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { Media as MediaModel } from '@generated/prisma/client';
import { ID } from '@inpro/core';

export class MediaMapper {
  static fromDomainToModel(media: Media): MediaModel {
    const { id, key, type, size, createdAt, updatedAt, purpose } =
      media.toObject();

    return {
      id,
      key,
      type,
      size,
      createdAt: new Date(createdAt),
      updatedAt,
      purpose: purpose ?? null,
    };
  }

  static fromModelToDomain(media: MediaModel): Media {
    return Media.create({
      id: ID.create(media.id).unwrap(),
      key: media.key,
      type: media.type,
      size: media.size,
      createdAt: new Date(media.createdAt),
      updatedAt: new Date(media.updatedAt),
      purpose: media.purpose ?? undefined,
    }).unwrap();
  }
}
