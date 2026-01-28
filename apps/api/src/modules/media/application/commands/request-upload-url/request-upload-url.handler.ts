import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  RequestUploadUrlCommand,
  RequestUploadUrlResult,
} from './request-upload-url.command';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';
import { FileStorageGateway } from '@shared/application/gateways/file-storage.gateway';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { MediaType } from '@modules/media/domain/enums/media-type.enum';
import { randomUUID } from 'crypto';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

@CommandHandler(RequestUploadUrlCommand)
export class RequestUploadUrlHandler
  implements ICommandHandler<RequestUploadUrlCommand>
{
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(
    command: RequestUploadUrlCommand,
  ): Promise<Result<RequestUploadUrlResult>> {
    const { filename, mimetype, size, purpose } = command;

    const mediaType = this.getMediaType(mimetype);

    if (!mediaType) {
      return Err(
        new BusinessException(
          'Unsupported file type',
          'UNSUPPORTED_FILE_TYPE',
          400,
        ),
      );
    }

    const maxSize =
      mediaType === MediaType.VIDEO ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (size > maxSize) {
      return Err(
        new BusinessException(
          `File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)`,
          'FILE_TOO_LARGE',
          400,
        ),
      );
    }

    const fileExtension = this.getFileExtension(filename);
    const key = `${purpose}/${randomUUID()}${fileExtension}`;

    const mediaResult = Media.create({
      key,
      type: mediaType,
      size,
      purpose,
    });

    if (mediaResult.isErr()) {
      return Err(
        new BusinessException(
          mediaResult.unwrapErr().message,
          'MEDIA_CREATION_ERROR',
          400,
        ),
      );
    }

    const media = mediaResult.unwrap();

    const saveResult = await this.mediaRepository.save(media);

    if (saveResult.isErr()) {
      return Err(
        new BusinessException(
          'Failed to create media record',
          'MEDIA_SAVE_ERROR',
          500,
        ),
      );
    }

    const presignedResult = await this.fileStorageGateway.getPresignedUploadUrl(
      {
        bucket: 'media',
        key,
        contentType: mimetype,
        expiresIn: 3600,
      },
    );

    if (presignedResult.isErr()) {
      return Err(
        new BusinessException(
          'Failed to generate upload URL',
          'PRESIGNED_URL_ERROR',
          500,
        ),
      );
    }

    const { uploadUrl, expiresAt } = presignedResult.unwrap();

    return Ok({
      mediaId: media.toObject().id,
      uploadUrl,
      expiresAt,
    });
  }

  private getMediaType(mimetype: string): MediaType | null {
    if (ALLOWED_IMAGE_TYPES.includes(mimetype)) {
      return MediaType.IMAGE;
    }
    if (ALLOWED_VIDEO_TYPES.includes(mimetype)) {
      return MediaType.VIDEO;
    }
    return null;
  }

  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
  }
}
