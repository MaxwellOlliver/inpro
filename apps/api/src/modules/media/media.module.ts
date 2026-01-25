import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { FileStorageModule } from '@shared/infra/file-storage/file-storage.module';
import { ImageProcessorModule } from '@shared/infra/image-processor/image-processor.module';
import { MediaRepositoryProvider } from './infra/providers/media-repository.provider';
import { MediaDeleteHandlerService } from './application/services/media-delete-handler.service';
import { MediaUploadHandlerService } from './application/services/media-upload-handler.service';
import { RequestUploadUrlHandler } from './application/commands/request-upload-url/request-upload-url.handler';
import { MediaController } from './presentation/http/controllers/media.controller';
import { MediaWebhookController } from './presentation/http/controllers/media-webhook.controller';
import { MediaProcessingProcessor } from './infra/queue/processors/media-processing.processor';
import { MediaStatusSseService } from './infra/sse/media-status.sse';

@Module({
  imports: [
    FileStorageModule,
    PrismaModule,
    ImageProcessorModule,
    BullModule.registerQueue({
      name: 'media-processing',
    }),
  ],
  providers: [
    MediaRepositoryProvider,
    MediaUploadHandlerService,
    MediaDeleteHandlerService,
    RequestUploadUrlHandler,
    MediaProcessingProcessor,
    MediaStatusSseService,
  ],
  controllers: [MediaController, MediaWebhookController],
  exports: [MediaRepositoryProvider],
})
export class MediaModule {}
