import { Provider } from '@nestjs/common';
import { PrismaPostReadStore } from '../read-stores/prisma-post.read-store';
import { PostReadStore } from '@modules/social/application/gateways/post.read-store.gateway';

export const PostReadStoreProvider: Provider = {
  provide: PostReadStore,
  useClass: PrismaPostReadStore,
};
