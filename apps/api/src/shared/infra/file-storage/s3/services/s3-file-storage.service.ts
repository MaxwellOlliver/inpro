import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT } from '../tokens/s3.tokens';
import {
  FileStorageGateway,
  FileUploadPayload,
  PresignedUploadUrlPayload,
  PresignedUploadUrlResult,
} from '@shared/application/gateways/file-storage.gateway';
import { Err, Ok, Result } from '@inpro/core';
import { EnvService } from '@config/env/env.service';

@Injectable()
export class S3FileStorageService implements FileStorageGateway {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly env: EnvService,
  ) {}

  async upload(payload: FileUploadPayload): Promise<Result<string, Error>> {
    const result = await Result.fromPromise(
      this.s3Client.send(
        new PutObjectCommand({
          Bucket: payload.bucket,
          Key: payload.key,
          Body: payload.buffer,
          ContentType: payload.mimetype,
          ContentLength: payload.size,
          CacheControl:
            payload.cacheControl ?? 'public, max-age=31536000, immutable',
        }),
      ),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const url = `${this.env.get('S3_ENDPOINT')}/${payload.bucket}/${payload.key}`;

    return Ok(url);
  }

  async delete(fileKey: string): Promise<Result<void, Error>> {
    const result = await Result.fromPromise(
      this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: fileKey.split('/')[0],
          Key: fileKey.split('/')[1],
        }),
      ),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok();
  }

  async getPresignedUploadUrl(
    payload: PresignedUploadUrlPayload,
  ): Promise<Result<PresignedUploadUrlResult, Error>> {
    const expiresIn = payload.expiresIn ?? 3600;

    const command = new PutObjectCommand({
      Bucket: payload.bucket,
      Key: payload.key,
      ContentType: payload.contentType,
    });

    const result = await Result.fromPromise(
      getSignedUrl(this.s3Client, command, { expiresIn }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const uploadUrl = result.unwrap();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return Ok({ uploadUrl, expiresAt });
  }
}
