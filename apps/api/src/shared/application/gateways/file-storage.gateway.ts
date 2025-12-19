import { Result } from '@inpro/core';

export type FileUploadPayload = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
};

export abstract class FileStorageGateway {
  abstract upload(payload: FileUploadPayload): Promise<Result<string, Error>>;
  abstract delete(fileKey: string): Promise<Result<void, Error>>;
}
