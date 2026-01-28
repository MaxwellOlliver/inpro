import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Public } from '@shared/infra/security/jwt/decorators/public.decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MediaProcessingJobData } from '@modules/media/infra/queue/processors/media-processing.processor';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';

interface MinioWebhookEvent {
  EventName: string;
  Key: string;
  Records: Array<{
    s3: {
      bucket: {
        name: string;
      };
      object: {
        key: string;
        size: number;
        contentType: string;
      };
    };
  }>;
}

@Controller('media')
export class MediaWebhookController {
  constructor(
    @InjectQueue('media-processing')
    private readonly mediaProcessingQueue: Queue<MediaProcessingJobData>,
    private readonly mediaRepository: MediaRepository,
  ) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleMinioWebhook(
    @Body() event: MinioWebhookEvent,
  ): Promise<{ received: boolean }> {
    if (!event.EventName?.startsWith('s3:ObjectCreated')) {
      return { received: true };
    }

    for (const record of event.Records ?? []) {
      if (record.s3.bucket.name !== 'media') continue;

      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      const mediaResult = await this.mediaRepository.findByKey(key);

      if (mediaResult.isErr()) {
        console.warn(`Media not found for key: ${key}`);
        continue;
      }

      const media = mediaResult.unwrap();
      const mediaObj = media.toObject();

      await this.mediaProcessingQueue.add(
        'process',
        {
          mediaId: mediaObj.id,
          bucket,
          key,
          mediaType: mediaObj.type,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
    }

    return { received: true };
  }
}
