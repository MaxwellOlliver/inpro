import { Injectable } from '@nestjs/common';
import { FileStorageGateway } from '@shared/application/gateways/file-storage.gateway';
import { ImageProcessorGateway } from '@shared/application/gateways/image-processor.gateway';
import { ProfileMediaFile } from '../commands/set-profile-media/set-profile-media.command';
import { Err, ID, Result } from '@inpro/core';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { MediaType } from '@modules/media/domain/enums/media-type.enum';

@Injectable()
export class UploadProfileMediaService {
  constructor(
    private readonly imageProcessorGateway: ImageProcessorGateway,
    private readonly fileStorageGateway: FileStorageGateway,
  ) {}

  async handle(
    profileId: string,
    file: ProfileMediaFile,
    kind: 'avatar' | 'banner',
    width: number,
    height: number,
  ): Promise<Result<Media>> {
    const media = await this.imageProcessorGateway.resize(
      file.buffer,
      width,
      height,
    );

    if (media.isErr()) {
      return Err(media.getErr()!);
    }

    const mediaBuffer = media.unwrap();

    const mediaId = ID.create().unwrap();

    console.log('start uploading');

    const mediaKey = await this.fileStorageGateway.upload({
      buffer: mediaBuffer,
      filename: file.filename,
      mimetype: 'image/webp',
      size: mediaBuffer.length,
      bucket: 'profile-media',
      key: `profile/${profileId}/${kind}/${mediaId.value()}.webp`,
    });

    console.log('uploaded');

    if (mediaKey.isErr()) {
      return Err(mediaKey.getErr()!);
    }

    const mediaResult = Media.create({
      id: mediaId,
      key: mediaKey.unwrap(),
      type: MediaType.IMAGE,
      size: mediaBuffer.length,
      purpose: kind,
    });

    return mediaResult;
  }
}
