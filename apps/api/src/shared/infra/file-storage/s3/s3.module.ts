import { Module } from '@nestjs/common';
import { S3FileStorageService } from './services/s3-file-storage.service';
import { S3ClientProvider } from './providers/s3-client.provider';
import { S3_FILE_STORAGE_SERVICE } from './tokens/s3.tokens';

@Module({
  providers: [
    S3FileStorageService,
    S3ClientProvider,
    {
      provide: S3_FILE_STORAGE_SERVICE,
      useExisting: S3FileStorageService,
    },
  ],
  exports: [S3FileStorageService, S3ClientProvider],
})
export class S3Module {}
