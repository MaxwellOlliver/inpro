import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module';
import { FileStorageGateway } from '@shared/application/gateways/file-storage.gateway';
import { S3FileStorageService } from './s3/services/s3-file-storage.service';

@Module({
  imports: [S3Module],
  providers: [
    {
      provide: FileStorageGateway,
      useExisting: S3FileStorageService,
    },
  ],
  exports: [S3Module, FileStorageGateway],
})
export class FileStorageModule {}
