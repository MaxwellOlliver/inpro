import { Command } from '@nestjs/cqrs';
import {
  CreateMediaInputDTO,
  CreateMediaOutputDTO,
} from '../ports/in/create-media.port';

export class CreateMediaCommand extends Command<CreateMediaOutputDTO> {
  constructor(public readonly dto: CreateMediaInputDTO) {
    super();
  }
}
