import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMediaCommand } from './create-media.command';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { Ok, Result } from '@inpro/core';
import { MediaUploadHandlerService } from '../../services/media-upload-handler.service';

@CommandHandler(CreateMediaCommand)
export class CreateMediaHandler implements ICommandHandler<CreateMediaCommand> {
  constructor(
    private readonly mediaUploadHandlerService: MediaUploadHandlerService,
  ) {}

  async execute(command: CreateMediaCommand): Promise<Result<Media>> {
    const { file, purpose } = command;

    const media = await this.mediaUploadHandlerService.handle(file, purpose);

    return Ok(media.unwrap());
  }
}
