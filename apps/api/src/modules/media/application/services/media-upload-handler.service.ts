import {
  FileStorageGateway,
  FileUploadPayload,
} from '@shared/application/gateways/file-storage.gateway';
import { Err, Ok, Result } from '@inpro/core';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { MediaType } from '@modules/media/domain/enums/media-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaUploadHandlerService {
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async handle(
    file: Express.Multer.File,
    purpose: string,
  ): Promise<Result<Media>> {
    const payload: FileUploadPayload = {
      buffer: file.buffer,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      bucket: 'media',
    };

    const keyResult = await this.fileStorageGateway.upload(payload);

    if (keyResult.isErr()) {
      return Err(keyResult.getErr()!);
    }

    const key = keyResult.unwrap();

    const mediaResult = Media.create({
      key: key,
      type: file.mimetype as MediaType,
      size: file.size,
      purpose: purpose,
    });

    if (mediaResult.isErr()) {
      return Err(mediaResult.unwrapErr());
    }

    const media = mediaResult.unwrap();

    const savedResult = await this.mediaRepository.save(media);

    if (savedResult.isErr()) {
      return Err(savedResult.unwrapErr());
    }

    return Ok(media);
  }
}
