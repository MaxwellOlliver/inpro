import { Result } from '@inpro/core';
import { Command } from '@nestjs/cqrs';

export class DeleteMediaCommand extends Command<Result<void>> {
  constructor(public readonly mediaId: string) {
    super();
  }
}
