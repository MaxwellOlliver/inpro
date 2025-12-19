import { Result } from '@inpro/core';
import { Command } from '@nestjs/cqrs';

interface SetProfileMediaFile {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
}

export class SetProfileMediaCommand extends Command<Result<void>> {
  constructor(
    public readonly profileId: string,
    public readonly avatarFile: SetProfileMediaFile,
    public readonly bannerFile: SetProfileMediaFile,
  ) {
    super();
  }
}
