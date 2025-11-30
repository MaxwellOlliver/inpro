import { Result } from '@inpro/core';

export type FileUploadPayload = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
};

export abstract class FileStoragePort {
  abstract uploadFile(
    payload: FileUploadPayload,
  ): Promise<Result<string, Error>>;
  abstract deleteFile(fileKey: string): Promise<Result<void, Error>>;
}
