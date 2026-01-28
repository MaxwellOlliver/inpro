import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';

export type RequestUploadUrlResult = {
  mediaId: string;
  uploadUrl: string;
  expiresAt: Date;
};

export class RequestUploadUrlCommand extends Command<
  Result<RequestUploadUrlResult>
> {
  constructor(
    public readonly filename: string,
    public readonly mimetype: string,
    public readonly size: number,
    public readonly purpose: string,
  ) {
    super();
  }
}
