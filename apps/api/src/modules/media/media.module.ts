import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { FileStorageModule } from '@shared/infra/file-storage/file-storage.module';
import { MediaRepositoryProvider } from './infra/providers/media-repository.provider';
import { MediaDeleteHandlerService } from './application/services/media-delete-handler.service';
import { MediaUploadHandlerService } from './application/services/media-upload-handler.service';

@Module({
  imports: [FileStorageModule, PrismaModule],
  providers: [
    MediaRepositoryProvider,
    MediaUploadHandlerService,
    MediaDeleteHandlerService,
  ],
  exports: [],
})
export class MediaModule {}
