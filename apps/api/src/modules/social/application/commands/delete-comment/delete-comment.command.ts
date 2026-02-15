import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';

export class DeleteCommentCommand extends Command<Result<void>> {
  constructor(
    public readonly commentId: string,
    public readonly profileId: string,
  ) {
    super();
  }
}
