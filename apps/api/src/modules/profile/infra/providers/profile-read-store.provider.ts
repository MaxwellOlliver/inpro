import { Provider } from '@nestjs/common';
import { PrismaProfileReadStore } from '../read-stores/prisma-profile.read-store';
import { ProfileReadStore } from '@modules/profile/application/read-stores/profile.read-store';

export const ProfileReadStoreProvider: Provider = {
  provide: ProfileReadStore,
  useClass: PrismaProfileReadStore,
};
