import { Result } from '@inpro/core';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { Command } from '@nestjs/cqrs';

export class CreateMediaCommand extends Command<Result<Media>> {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly purpose: string,
  ) {
    super();
  }
}
