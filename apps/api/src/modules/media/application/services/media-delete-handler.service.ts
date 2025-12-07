import { FileStorageGateway } from '@shared/application/gateways/file-storage.gateway';
import { Err, ID, Ok, Result } from '@inpro/core';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaDeleteHandlerService {
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async handle(mediaId: ID): Promise<Result<void>> {
    const mediaResult = await this.mediaRepository.findById(mediaId);

    if (mediaResult.isErr()) {
      return Err(mediaResult.unwrapErr());
    }

    const media = mediaResult.unwrap();

    const deletedResult = await this.fileStorageGateway.delete(
      media.get('key'),
    );

    if (deletedResult.isErr()) {
      return Err(deletedResult.getErr()!);
    }

    const deletedMedia = await this.mediaRepository.delete(media.id);

    if (deletedMedia.isErr()) {
      return Err(deletedMedia.getErr()!);
    }

    return Ok();
  }
}
