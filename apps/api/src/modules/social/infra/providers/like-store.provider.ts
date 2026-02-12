import { Provider } from '@nestjs/common';
import { LikeStore } from '@modules/social/application/gateways/like.store.gateway';
import { PrismaLikeStore } from '../read-stores/prisma-like.store';

export const LikeStoreProvider: Provider = {
  provide: LikeStore,
  useClass: PrismaLikeStore,
};
