import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMediaCommand } from '../create-media.command';
import { CreateMediaOutputDTO } from '../../ports/in/create-media.port';
import { IMediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';
import { MediaType } from '@modules/media/domain/enums/media-type.enum';
import { Err, Ok } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(CreateMediaCommand)
export class CreateMediaHandler
  implements ICommandHandler<CreateMediaCommand, CreateMediaOutputDTO>
{
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async execute(command: CreateMediaCommand): Promise<CreateMediaOutputDTO> {
    const { dto } = command;

    const media = Media.create({
      url: dto.file.path,
      type: dto.file.mimetype as MediaType,
      size: dto.file.size,
      purpose: dto.purpose,
    });

    if (media.isErr()) {
      return Err(
        new BusinessException(
          media.unwrapErr().message,
          'MEDIA_CREATION_ERROR',
          400,
        ),
      );
    }

    const mediaSaved = await this.mediaRepository.save(media.unwrap());

    if (mediaSaved.isErr()) {
      throw new BusinessException(
        mediaSaved.unwrapErr().message,
        'MEDIA_SAVING_ERROR',
        400,
      );
    }

    return Ok(mediaSaved.unwrap());
  }
}
