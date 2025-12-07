import { MediaRepository } from '@modules/media/domain/repositories/media.repository';
import { Provider } from '@nestjs/common';
import { PrismaMediaRepository } from '../repositories/prisma-media.repository';

export const MediaRepositoryProvider: Provider = {
  provide: MediaRepository,
  useClass: PrismaMediaRepository,
};
