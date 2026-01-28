import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { FileStorageGateway } from '@shared/application/gateways/file-storage.gateway';
import { ImageProcessorGateway } from '@shared/application/gateways/image-processor.gateway';
import { MediaStatusSseService } from '../../sse/media-status.sse';
import { MediaStatus } from '@modules/media/domain/enums/media-status.enum';
import { MediaType } from '@modules/media/domain/enums/media-type.enum';
import { EnvService } from '@config/env/env.service';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject } from '@nestjs/common';
import { S3_CLIENT } from '@shared/infra/file-storage/s3/tokens/s3.tokens';
import { ID, Result } from '@inpro/core';

export interface MediaProcessingJobData {
  mediaId: string;
  bucket: string;
  key: string;
  mediaType: MediaType;
}

const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_HEIGHT = 1080;
const IMAGE_QUALITY = 82;

@Injectable()
@Processor('media-processing', {
  concurrency: 5,
})
export class MediaProcessingProcessor extends WorkerHost {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly imageProcessorGateway: ImageProcessorGateway,
    private readonly mediaStatusSse: MediaStatusSseService,
    private readonly env: EnvService,
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
  ) {
    super();
  }

  async process(job: Job<MediaProcessingJobData>): Promise<void> {
    const { mediaId, bucket, key, mediaType } = job.data;

    const mediaResult = await this.mediaRepository.findById(
      ID.create(mediaId).unwrap(),
    );

    if (mediaResult.isErr()) {
      this.emitFailed(mediaId, 'Media not found');
      throw new Error('Media not found');
    }

    const media = mediaResult.unwrap();
    media.markAsProcessing();
    await this.mediaRepository.save(media);

    this.mediaStatusSse.emit({
      mediaId,
      status: MediaStatus.PROCESSING,
    });

    try {
      if (mediaType === MediaType.IMAGE) {
        await this.processImage(mediaId, bucket, key);
      } else if (mediaType === MediaType.VIDEO) {
        // For now, just mark videos as ready without processing
        // Video transcoding can be added later
        await this.markAsReady(mediaId, media.toObject().size);
      } else {
        // Other types just mark as ready
        await this.markAsReady(mediaId, media.toObject().size);
      }
    } catch (error) {
      await this.handleFailure(mediaId, error);
      throw error;
    }
  }

  private async processImage(
    mediaId: string,
    bucket: string,
    key: string,
  ): Promise<void> {
    // Download from S3
    const downloadResult = await this.downloadFromS3(bucket, key);

    if (downloadResult.isErr()) {
      throw downloadResult.unwrapErr();
    }

    const originalBuffer = downloadResult.unwrap();

    // Process image
    const processedResult = await this.imageProcessorGateway.resize(
      originalBuffer,
      IMAGE_MAX_WIDTH,
      IMAGE_MAX_HEIGHT,
      {
        fit: 'inside',
        format: 'webp',
        quality: IMAGE_QUALITY,
      },
    );

    if (processedResult.isErr()) {
      throw processedResult.unwrapErr();
    }

    const processedBuffer = processedResult.unwrap();

    // Generate new key with .webp extension
    const newKey = key.replace(/\.[^.]+$/, '.webp');

    // Upload processed image
    const uploadResult = await this.fileStorageGateway.upload({
      bucket,
      key: newKey,
      buffer: processedBuffer,
      mimetype: 'image/webp',
      size: processedBuffer.length,
      filename: newKey,
    });

    if (uploadResult.isErr()) {
      throw uploadResult.unwrapErr();
    }

    // Delete original if key changed
    if (newKey !== key) {
      await this.fileStorageGateway.delete(`${bucket}/${key}`);
    }

    // Update media record
    await this.markAsReady(mediaId, processedBuffer.length, newKey);
  }

  private async downloadFromS3(
    bucket: string,
    key: string,
  ): Promise<Result<Buffer, Error>> {
    const result = await Result.fromPromise<Buffer, Error>(
      (async () => {
        const response = await this.s3Client.send(
          new GetObjectCommand({ Bucket: bucket, Key: key }),
        );

        const chunks: Buffer[] = [];
        const stream = response.Body as NodeJS.ReadableStream;

        for await (const chunk of stream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        return Buffer.concat(chunks);
      })(),
    );

    return result;
  }

  private async markAsReady(
    mediaId: string,
    newSize: number,
    newKey?: string,
  ): Promise<void> {
    const mediaResult = await this.mediaRepository.findById(
      ID.create(mediaId).unwrap(),
    );

    if (mediaResult.isErr()) {
      throw new Error('Media not found');
    }

    const media = mediaResult.unwrap();
    media.markAsReady(newSize, newKey);
    await this.mediaRepository.save(media);

    this.mediaStatusSse.emit({
      mediaId,
      status: MediaStatus.READY,
      size: newSize,
    });
  }

  private async handleFailure(mediaId: string, error: unknown): Promise<void> {
    const mediaResult = await this.mediaRepository.findById(
      ID.create(mediaId).unwrap(),
    );

    if (mediaResult.isOk()) {
      const media = mediaResult.unwrap();
      media.markAsFailed();
      await this.mediaRepository.save(media);
    }

    this.emitFailed(
      mediaId,
      error instanceof Error ? error.message : 'Unknown error',
    );
  }

  private emitFailed(mediaId: string, errorMessage: string): void {
    this.mediaStatusSse.emit({
      mediaId,
      status: MediaStatus.FAILED,
      error: errorMessage,
    });
  }
}
