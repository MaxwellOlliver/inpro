import { Module } from '@nestjs/common';
import { S3FileStorageService } from './services/s3-file-storage.service';
import { S3ClientProvider } from './providers/s3-client.provider';

@Module({
  providers: [S3FileStorageService, S3ClientProvider],
  exports: [S3FileStorageService],
})
export class S3Module {}
