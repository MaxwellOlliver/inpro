import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { PrismaProfileRepository } from '../repositories/prisma-profile.repository';
import { Provider } from '@nestjs/common';

export const ProfileRepositoryProvider: Provider = {
  provide: ProfileRepository,
  useClass: PrismaProfileRepository,
};
