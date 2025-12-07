import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMediaCommand } from './delete-media.command';
import { Err, ID, Ok, Result } from '@inpro/core';
import { MediaDeleteHandlerService } from '../../services/media-delete-handler.service';

@CommandHandler(DeleteMediaCommand)
export class DeleteMediaHandler implements ICommandHandler<DeleteMediaCommand> {
  constructor(
    private readonly mediaDeleteHandlerService: MediaDeleteHandlerService,
  ) {}

  async execute(command: DeleteMediaCommand): Promise<Result<void>> {
    const { mediaId } = command;

    const id = ID.create(mediaId).unwrap();

    const result = await this.mediaDeleteHandlerService.handle(id);

    if (result.isErr()) {
      return Err(result.unwrapErr());
    }

    return Ok();
  }
}
