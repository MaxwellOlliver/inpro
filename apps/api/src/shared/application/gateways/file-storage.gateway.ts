import { Result } from '@inpro/core';

export type FileUploadPayload = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  cacheControl?: string;
};

export type PresignedUploadUrlPayload = {
  bucket: string;
  key: string;
  contentType: string;
  expiresIn?: number; // seconds, default 3600
};

export type PresignedUploadUrlResult = {
  uploadUrl: string;
  expiresAt: Date;
};

export abstract class FileStorageGateway {
  abstract upload(payload: FileUploadPayload): Promise<Result<string, Error>>;
  abstract delete(fileKey: string): Promise<Result<void, Error>>;
  abstract getPresignedUploadUrl(
    payload: PresignedUploadUrlPayload,
  ): Promise<Result<PresignedUploadUrlResult, Error>>;
}
