import { Module } from '@nestjs/common';
import { S3Gateway } from './s3.gateway';

@Module({
  providers: [S3Gateway],
  exports: [S3Gateway],
})
export class S3Module {}
