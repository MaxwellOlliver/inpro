import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';

export class DeleteProfileCommand extends Command<Result<void>> {
  constructor(public readonly userId: string) {
    super();
  }
}
