import { Result } from '@inpro/core';
import { Command } from '@nestjs/cqrs';

export interface ProfileMediaFile {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
}

export class SetProfileMediaCommand extends Command<Result<void>> {
  constructor(
    public readonly userId: string,
    public readonly avatarFile: ProfileMediaFile,
    public readonly bannerFile: ProfileMediaFile,
  ) {
    super();
  }
}
