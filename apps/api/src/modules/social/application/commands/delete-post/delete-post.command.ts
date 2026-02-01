import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';

export class DeletePostCommand extends Command<Result<void>> {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
