import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Result } from '@inpro/core';

@Injectable()
export class S3Gateway implements OnModuleInit {
  private s3: S3Client;

  onModuleInit() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'admin',
        secretAccessKey: 'admin12345',
      },
    });
  }

  putObject(
    bucket: string,
    key: string,
    body: Buffer,
  ): Promise<Result<PutObjectCommandOutput, Error>> {
    return Result.fromPromise(
      this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
        }),
      ),
    );
  }

  deleteObject(
    bucket: string,
    key: string,
  ): Promise<Result<DeleteObjectCommandOutput, Error>> {
    return Result.fromPromise(
      this.s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      ),
    );
  }
}
