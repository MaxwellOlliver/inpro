import { Provider } from '@nestjs/common';
import { PrismaActivityReadStore } from '../read-stores/prisma-activity.read-store';
import { ActivityReadStore } from '@modules/social/application/gateways/activity.read-store.gateway';

export const ActivityReadStoreProvider: Provider = {
  provide: ActivityReadStore,
  useClass: PrismaActivityReadStore,
};
